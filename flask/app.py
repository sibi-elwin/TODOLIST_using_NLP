from flask import Flask, request, jsonify
import joblib
import spacy

app = Flask(__name__)

# Load spaCy model
nlp = spacy.load("en_core_web_sm")

# Load the TaskClassifier
class TaskClassifier:
    def __init__(self):
        self.pipeline_category = None
        self.pipeline_priority = None
        self.label_encoder_category = None
        self.label_encoder_priority = None

    def preprocess_text(self, text):
        doc = nlp(text.lower())
        tokens = [token.lemma_ for token in doc
                 if not token.is_stop and not token.is_punct
                 and not token.like_num and len(token) > 2]
        return " ".join(tokens)

    @classmethod
    def load(cls, filepath="task_classifier.pkl"):
        model_data = joblib.load(filepath)
        classifier = cls()
        classifier.pipeline_category = model_data["pipeline_category"]
        classifier.pipeline_priority = model_data["pipeline_priority"]
        classifier.label_encoder_category = model_data["label_encoder_category"]
        classifier.label_encoder_priority = model_data["label_encoder_priority"]
        return classifier

# Load the trained classifier
classifier = TaskClassifier.load("model/task_classifier.pkl")

@app.route('/predict', methods=['POST'])
def predict():
    try:
        # Get data from request
        data = request.json
        text = data.get('text', '')

        if not text:
            return jsonify({'error': 'Text field is required'}), 400

        # Preprocess text
        processed_text = classifier.preprocess_text(text)

        # Get predictions
        category_prediction = classifier.pipeline_category.predict([processed_text])[0]
        category_proba = classifier.pipeline_category.predict_proba([processed_text]).max()

        priority_prediction = classifier.pipeline_priority.predict([processed_text])[0]
        priority_proba = classifier.pipeline_priority.predict_proba([processed_text]).max()

        # Get predicted category and priority
        predicted_category = classifier.label_encoder_category.inverse_transform([category_prediction])[0]
        predicted_priority = classifier.label_encoder_priority.inverse_transform([priority_prediction])[0]

        return jsonify({
            'predicted_category': predicted_category,
            'category_confidence': round(category_proba, 4),
            'predicted_priority': predicted_priority,
            'priority_confidence': round(priority_proba, 4),
            'input_text': text
        })

    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == "__main__":
    app.run(host='0.0.0.0', port=5000)
