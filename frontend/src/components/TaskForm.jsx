import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify';
import { 
  FaMicrophone, 
  FaStop, 
  FaTrash, 
  FaPlay, 
  FaClock, 
  FaTasks,
  FaRegStickyNote,
  FaBell
} from 'react-icons/fa';
import axios from 'axios';
import { getTaskAnalysis } from '../services/aiService';

const TaskForm = ({ onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [dueTime, setDueTime] = useState('');
  const [reminderTime, setReminderTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  // Voice recording states
  const [isRecording, setIsRecording] = useState(false);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioRef = useRef(null);

  // Add new state for speech recognition
  const [transcript, setTranscript] = useState('');
  const recognitionRef = useRef(null);

  // Initialize speech recognition
  useEffect(() => {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.webkitSpeechRecognition || window.SpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = true;
      recognitionRef.current.interimResults = true;

      recognitionRef.current.onresult = (event) => {
        let finalTranscript = '';
        let interimTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; i++) {
          const transcript = event.results[i][0].transcript;
          if (event.results[i].isFinal) {
            finalTranscript += transcript + ' ';
          } else {
            interimTranscript += transcript;
          }
        }

        if (finalTranscript) {
          setTranscript(prevTranscript => prevTranscript + finalTranscript);
          setDescription(prevDescription => {
            const newText = prevDescription ? 
              `${prevDescription}\n${finalTranscript}` : 
              finalTranscript;
            return newText.trim();
          });
        }
      };

      recognitionRef.current.onerror = (event) => {
        console.error('Speech recognition error:', event.error);
        stopRecording();
        toast.error('Speech recognition error. Please try again.');
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  }, []);

  const startRecording = async () => {
    try {
      if (!recognitionRef.current) {
        toast.error('Speech recognition is not supported in your browser');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRecorderRef.current = new MediaRecorder(stream);
      const chunks = [];

      mediaRecorderRef.current.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunks.push(e.data);
        }
      };

      mediaRecorderRef.current.onstop = () => {
        const blob = new Blob(chunks, { type: 'audio/webm' });
        setAudioBlob(blob);
      };

      // Start both audio recording and speech recognition
      mediaRecorderRef.current.start();
      recognitionRef.current.start();
      setIsRecording(true);
      setTranscript('');
      toast.info('Recording started');
    } catch (error) {
      console.error('Error accessing microphone:', error);
      toast.error('Could not access microphone');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
      toast.success('Recording stopped');
    }
  };

  const playRecording = () => {
    if (audioBlob && !isPlaying) {
      const audioUrl = URL.createObjectURL(audioBlob);
      audioRef.current = new Audio(audioUrl);
      audioRef.current.onended = () => setIsPlaying(false);
      audioRef.current.play();
      setIsPlaying(true);
    }
  };

  const stopPlaying = () => {
    if (audioRef.current && isPlaying) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      setIsPlaying(false);
    }
  };

  const deleteRecording = () => {
    setAudioBlob(null);
    setTranscript('');
    if (audioRef.current) {
      audioRef.current = null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Combine date and time for both due date and reminder
      let dueDatetime = null;
      let reminderDatetime = null;

      if (dueDate) {
        const dateObj = new Date(dueDate);
        if (dueTime) {
          const [hours, minutes] = dueTime.split(':');
          dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        }
        dueDatetime = dateObj.toISOString();
      }

      if (dueDate && reminderTime) {
        const dateObj = new Date(dueDate);
        const [hours, minutes] = reminderTime.split(':');
        dateObj.setHours(parseInt(hours, 10), parseInt(minutes, 10));
        reminderDatetime = dateObj.toISOString();
      }

      // Create the task data object
      const taskData = {
        title: title,
        description: description,
        dueDate: dueDatetime,
        reminderTime: reminderDatetime,
        category: 'general',  // Default value
        priority: 'medium'    // Default value
      };

      try {
        // Get category and priority from AI service
        const aiAnalysis = await getTaskAnalysis(title, description);
        console.log('Full AI Analysis:', aiAnalysis);
        
        if (aiAnalysis && aiAnalysis.analysis) {
          taskData.category = aiAnalysis.analysis.category?.label?.toLowerCase() || 'general';
          taskData.priority = aiAnalysis.analysis.priority?.level?.toLowerCase() || 'medium';
        }
      } catch (aiError) {
        console.error('AI Service Error:', aiError);
        toast.warning('Using default category and priority');
      }

      // Create FormData object
      const formData = new FormData();
      formData.append('taskData', JSON.stringify(taskData));
      
      if (audioBlob) {
        formData.append('audioRecording', audioBlob, `task_audio_${Date.now()}.webm`);
      }

      const response = await axios.post('http://localhost:3000/api/tasks', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (response.status === 201) {
        toast.success('Task created successfully!');
        if (onTaskCreated) {
          onTaskCreated(response.data);
        }

        // Reset form
        setTitle('');
        setDescription('');
        setDueDate('');
        setDueTime('');
        setReminderTime('');
        setAudioBlob(null);
        if (audioRef.current) {
          audioRef.current = null;
        }
      }
    } catch (error) {
      console.error('Error creating task:', error);
      const errorMessage = error.response?.data?.message || 'Failed to create task';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gray-800/95 backdrop-blur-sm rounded-xl p-8 shadow-2xl border border-gray-700/50"
    >
      <div className="flex items-center gap-3 mb-8">
        <FaTasks className="text-indigo-400 w-6 h-6" />
        <h2 className="text-xl font-semibold text-white">Create New Task</h2>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Title Input */}
        <motion.div 
          className="space-y-2"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <label className="flex items-center gap-2 text-white text-sm font-medium pl-1">
            <FaTasks className="text-indigo-400" />
            Task Title
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="w-full bg-gray-700/50 backdrop-blur-sm text-white rounded-xl px-4 py-3 
                     border border-gray-600/50 focus:border-indigo-500 focus:ring-2 
                     focus:ring-indigo-500/50 outline-none transition-all placeholder-gray-400"
            required
          />
        </motion.div>

        {/* Description Input with Voice Recording */}
        <motion.div 
          className="space-y-2"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <label className="flex items-center gap-2 text-white text-sm font-medium pl-1">
            <FaRegStickyNote className="text-indigo-400" />
            Description
          </label>
          <div className="relative">
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Add more details about your task..."
              className="w-full bg-gray-700/50 backdrop-blur-sm text-white rounded-xl px-4 py-3 
                       border border-gray-600/50 focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-500/50 outline-none transition-all min-h-[120px] 
                       placeholder-gray-400 resize-none pr-12"
              rows="3"
            />
            <div className="absolute top-3 right-3 flex gap-2">
              <AnimatePresence>
                {!isRecording ? (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={startRecording}
                    className="p-2 bg-indigo-600 rounded-full text-white 
                             hover:bg-indigo-700 transition-all shadow-lg"
                  >
                    <FaMicrophone className="w-4 h-4" />
                  </motion.button>
                ) : (
                  <motion.button
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    type="button"
                    onClick={stopRecording}
                    className="p-2 bg-red-500 rounded-full text-white 
                             hover:bg-red-600 transition-all shadow-lg animate-pulse"
                  >
                    <FaStop className="w-4 h-4" />
                  </motion.button>
                )}

                {audioBlob && (
                  <>
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={isPlaying ? stopPlaying : playRecording}
                      className="p-2 bg-green-500 rounded-full text-white 
                               hover:bg-green-600 transition-all shadow-lg"
                    >
                      <FaPlay className="w-4 h-4" />
                    </motion.button>
                    
                    <motion.button
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      type="button"
                      onClick={deleteRecording}
                      className="p-2 bg-red-500 rounded-full text-white 
                               hover:bg-red-600 transition-all shadow-lg"
                    >
                      <FaTrash className="w-4 h-4" />
                    </motion.button>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        </motion.div>

        {/* Due Date and Time Input */}
        <motion.div 
          className="space-y-2"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <label className="flex items-center gap-2 text-white text-sm font-medium pl-1">
            <FaClock className="text-indigo-400" />
            Due Date & Time
          </label>
          <div className="flex gap-4">
            <input
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 bg-gray-700/50 backdrop-blur-sm text-white rounded-xl px-4 py-3 
                       border border-gray-600/50 focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-500/50 outline-none transition-all"
            />
            <input
              type="time"
              value={dueTime}
              onChange={(e) => setDueTime(e.target.value)}
              className="w-32 bg-gray-700/50 backdrop-blur-sm text-white rounded-xl px-4 py-3 
                       border border-gray-600/50 focus:border-indigo-500 focus:ring-2 
                       focus:ring-indigo-500/50 outline-none transition-all"
            />
          </div>
        </motion.div>

        {/* Reminder Time Input */}
        <motion.div 
          className="space-y-2"
          initial={{ x: -20 }}
          animate={{ x: 0 }}
        >
          <label className="flex items-center gap-2 text-white text-sm font-medium pl-1">
            <FaBell className="text-indigo-400" />
            Reminder Time (Optional)
          </label>
          <input
            type="time"
            value={reminderTime}
            onChange={(e) => setReminderTime(e.target.value)}
            className="w-32 bg-gray-700/50 backdrop-blur-sm text-white rounded-xl px-4 py-3 
                     border border-gray-600/50 focus:border-indigo-500 focus:ring-2 
                     focus:ring-indigo-500/50 outline-none transition-all"
          />
        </motion.div>

        {/* Optional: Add a transcription preview */}
        {isRecording && transcript && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 p-3 bg-gray-700/30 rounded-lg text-gray-300 text-sm"
          >
            <p className="font-medium mb-1">Transcribing...</p>
            <p className="italic">{transcript}</p>
          </motion.div>
        )}

        {/* Submit Button */}
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isLoading}
          className={`w-full bg-indigo-600 text-white py-4 px-6 rounded-xl
                     font-medium hover:bg-indigo-700 transition-all
                     focus:outline-none focus:ring-2 focus:ring-indigo-500/50
                     flex items-center justify-center gap-2
                     ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              <span>Creating Task...</span>
            </>
          ) : (
            <>
              <FaTasks className="w-5 h-5" />
              <span>Create Task</span>
            </>
          )}
        </motion.button>
      </form>
    </motion.div>
  );
};

export default TaskForm;