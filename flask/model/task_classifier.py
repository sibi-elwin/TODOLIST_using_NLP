import spacy
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.pipeline import Pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report
import random
from sklearn.preprocessing import LabelEncoder
from sklearn.ensemble import RandomForestClassifier

# Load spaCy NLP model
nlp = spacy.load("en_core_web_sm")

# Categories for Older Adults with descriptions
categories = {
    "Health & Wellness": "Tasks related to medical care, exercise, and healthy living",
    "Finance & Bills": "Tasks related to money management and financial responsibilities",
    "Home Maintenance": "Tasks related to household upkeep and organization",
    "Social & Communication": "Tasks related to maintaining relationships and social engagement",
    "Technology Assistance": "Tasks related to using and maintaining digital devices"
}

# Enhanced task templates with more variety
task_templates = {
    "Health & Wellness": [
        "Take {time} medications",
        "Schedule {specialist} appointment",
        "Do {duration} of {exercise}",
        "Drink {amount} of water",
        "Prepare {meal} with {ingredients}",
        "Check blood pressure and record reading",
        "Organize weekly pill container",
        "Practice meditation for relaxation",
        "Track daily steps using pedometer",
        "Schedule annual flu vaccination"
    ],
    "Finance & Bills": [
        "Pay {utility} bill due on {date}",
        "Review {account} statement",
        "Update {document} records",
        "Set up automatic payment for {bill}",
        "Check retirement account balance",
        "Organize tax documents",
        "Review monthly budget",
        "Contact insurance provider about {topic}",
        "Update beneficiary information",
        "Review credit card statements"
    ],
    "Home Maintenance": [
        "Water {location} plants",
        "Check {appliance} for maintenance",
        "Clean {room} area",
        "Make shopping list for {items}",
        "Organize {storage} space",
        "Replace air filters",
        "Check smoke detector batteries",
        "Sort through {category} items",
        "Schedule {service} maintenance",
        "Declutter {space} area"
    ],
    "Social & Communication": [
        "Call {relation} for {duration} chat",
        "Send message to {person} about {topic}",
        "Attend {event} at {location}",
        "Join {activity} group",
        "Read {material} for {duration}",
        "Write letter to {relation}",
        "Schedule virtual meetup with {group}",
        "Share photos with {relation}",
        "Plan {occasion} celebration",
        "Join online community discussion"
    ],
    "Technology Assistance": [
        "Charge {device} battery",
        "Update {software} on {device}",
        "Learn to use {feature} on {device}",
        "Organize {digital} files",
        "Watch tutorial about {tech_topic}",
        "Back up important files",
        "Clear unused apps from device",
        "Set up {security} features",
        "Connect to {network} safely",
        "Organize digital photos"
    ]
}

# Template variables for dynamic task generation
template_vars = {
    "time": ["morning", "evening", "afternoon", "daily"],
    "specialist": ["doctor", "dentist", "eye doctor", "physical therapist", "cardiologist"],
    "duration": ["10 minutes", "15 minutes", "30 minutes", "an hour"],
    "exercise": ["walking", "stretching", "chair yoga", "swimming", "gentle exercises"],
    "amount": ["8 glasses", "2 liters", "64 ounces"],
    "meal": ["breakfast", "lunch", "dinner", "snack"],
    "ingredients": ["fresh fruits", "vegetables", "whole grains", "lean protein"],
    "utility": ["electricity", "water", "gas", "internet", "phone"],
    "date": [f"{random.randint(1,28)}/{random.randint(1,12)}/2024" for _ in range(5)],
    "account": ["checking", "savings", "investment", "retirement"],
    "document": ["insurance", "medical", "tax", "property"],
    "bill": ["mortgage", "utilities", "insurance", "subscription"],
    "topic": ["coverage", "claims", "policy updates", "benefits"],
    "location": ["indoor", "outdoor", "balcony", "window"],
    "appliance": ["dishwasher", "washing machine", "refrigerator", "microwave", "oven"],
    "room": ["kitchen", "bathroom", "bedroom", "living room"],
    "items": ["groceries", "cleaning supplies", "household items", "personal care"],
    "storage": ["closet", "pantry", "garage", "basement"],
    "category": ["clothing", "papers", "kitchen items", "decorations"],
    "service": ["plumbing", "electrical", "HVAC", "pest control"],
    "space": ["drawer", "shelf", "counter", "cabinet"],
    "relation": ["family member", "friend", "grandchild", "sibling"],
    "person": ["neighbor", "doctor", "caregiver", "friend"],
    "event": ["community gathering", "book club", "exercise class", "social hour"],
    "activity": ["reading", "gardening", "crafts", "discussion"],
    "material": ["book", "magazine", "newspaper", "online article"],
    "group": ["family", "friends", "community group", "support group"],
    "occasion": ["birthday", "holiday", "anniversary", "reunion"],
    "device": ["phone", "tablet", "computer", "smart TV"],
    "software": ["apps", "operating system", "security software", "browser"],
    "feature": ["video calling", "email", "messaging", "social media"],
    "digital": ["emails", "documents", "photos", "contacts"],
    "tech_topic": ["online safety", "digital banking", "social media", "video calling"],
    "security": ["password", "antivirus", "backup", "privacy"],
    "network": ["WiFi", "Bluetooth", "home network", "public WiFi"]
}

priority_levels = ["High", "Medium", "Low"]

def generate_task(template):
    """Generate a task by filling in template variables"""
    task = template
    for var in template_vars:
        if "{" + var + "}" in task:
            task = task.replace("{" + var + "}", random.choice(template_vars[var]))
    return task

class TaskClassifier:
    def __init__(self):
        self.pipeline_category = None
        self.pipeline_priority = None
        self.label_encoder_category = LabelEncoder()
        self.label_encoder_priority = LabelEncoder()

    def preprocess_text(self, text):
        doc = nlp(text.lower())
        tokens = [token.lemma_ for token in doc
                 if not token.is_stop and not token.is_punct
                 and not token.like_num and len(token) > 2]
        return " ".join(tokens)

    def generate_dataset(self, n_samples=5000):
        data = []
        for _ in range(n_samples):
            category = random.choice(list(categories.keys()))
            template = random.choice(task_templates[category])
            task = generate_task(template)
            priority = random.choice(priority_levels)
            data.append({"Task": task, "Category": category, "Priority": priority})
        return pd.DataFrame(data)

    def train(self, df=None, n_samples=5000):
        if df is None:
            df = self.generate_dataset(n_samples)

        # Preprocess tasks
        df["Processed_Task"] = df["Task"].apply(self.preprocess_text)

        # Encode labels
        y_category = self.label_encoder_category.fit_transform(df["Category"])
        y_priority = self.label_encoder_priority.fit_transform(df["Priority"])

        # Split data
        X_train, X_test, y_train_category, y_test_category, y_train_priority, y_test_priority = train_test_split(
            df["Processed_Task"], y_category, y_priority, test_size=0.2, random_state=42, stratify=y_category
        )

        # Create pipelines for category and priority
        self.pipeline_category = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=1000,
                min_df=2
            )),
            ("clf", RandomForestClassifier(
                n_estimators=100,
                class_weight="balanced",
                random_state=42
            ))
        ])

        self.pipeline_priority = Pipeline([
            ("tfidf", TfidfVectorizer(
                ngram_range=(1, 2),
                max_features=1000,
                min_df=2
            )),
            ("clf", RandomForestClassifier(
                n_estimators=100,
                class_weight="balanced",
                random_state=42
            ))
        ])

        # Train models
        self.pipeline_category.fit(X_train, y_train_category)
        self.pipeline_priority.fit(X_train, y_train_priority)

        # Evaluate
        y_pred_category = self.pipeline_category.predict(X_test)
        y_pred_priority = self.pipeline_priority.predict(X_test)

        accuracy_category = accuracy_score(y_test_category, y_pred_category)
        accuracy_priority = accuracy_score(y_test_priority, y_pred_priority)

        return {
            "accuracy_category": accuracy_category,
            "accuracy_priority": accuracy_priority,
            "category_classification_report": classification_report(y_test_category, y_pred_category),
            "priority_classification_report": classification_report(y_test_priority, y_pred_priority)
        }

    def predict(self, tasks):
        """Predict categories for new tasks"""
        if isinstance(tasks, str):
            tasks = [tasks]

        processed_tasks = [self.preprocess_text(task) for task in tasks]
        category_predictions = self.pipeline_category.predict(processed_tasks)
        priority_predictions = self.pipeline_priority.predict(processed_tasks)

        return [
            {
                "task": task,
                "predicted_category": self.label_encoder_category.inverse_transform([cat_pred])[0],
                "predicted_priority": self.label_encoder_priority.inverse_transform([pri_pred])[0]
            }
            for task, cat_pred, pri_pred in zip(tasks, category_predictions, priority_predictions)
        ]

    def save(self, filepath="task_classifier.pkl"):
        """Save the trained model"""
        model_data = {
            "pipeline_category": self.pipeline_category,
            "pipeline_priority": self.pipeline_priority,
            "label_encoder_category": self.label_encoder_category,
            "label_encoder_priority": self.label_encoder_priority
        }
        joblib.dump(model_data, filepath)

    @classmethod
    def load(cls, filepath="task_classifier.pkl"):
        """Load a trained model"""
        model_data = joblib.load(filepath)
        classifier = cls()
        classifier.pipeline_category = model_data["pipeline_category"]
        classifier.pipeline_priority = model_data["pipeline_priority"]
        classifier.label_encoder_category = model_data["label_encoder_category"]
        classifier.label_encoder_priority = model_data["label_encoder_priority"]
        return classifier

# Example usage
if __name__ == "__main__":
    classifier = TaskClassifier()
    results = classifier.train()

    # Print the accuracies
    print(f"Category Model Accuracy: {results['accuracy_category']:.2f}")
    print(f"Priority Model Accuracy: {results['accuracy_priority']:.2f}")

    # Print classification reports
    print("\nCategory Classification Report:\n", results["category_classification_report"])
    print("\nPriority Classification Report:\n", results["priority_classification_report"])

    # Save model
    classifier.save()
    print("Model saved successfully!")

    # Example predictions
    test_tasks = [
        "Take evening medications and record in health diary",
        "Pay electricity bill due next week",
        "Learn how to use video chat on smartphone"
    ]

    # Get predictions for categories and priorities
    predictions = classifier.predict(test_tasks)

    for prediction in predictions:
        print(f"\nTask: {prediction['task']}\nPredicted Category: {prediction['predicted_category']}\nPredicted Priority: {prediction['predicted_priority']}")