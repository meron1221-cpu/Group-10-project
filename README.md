# 🛡️ AI-Powered Scam Detection Tool

An **AI-driven scam detection system** that leverages **Natural Language Processing (NLP)** and **Machine Learning (ML)** to identify scam communications such as phishing emails, SMS fraud, and online investment scams.  
The tool provides a **classification result (Scam/Legit)**, a **confidence score**, and **explanations** highlighting suspicious indicators (e.g., urgent language, OTP requests, malicious URLs).  

🔗 **Live Demo**: [Scam Detection Tool](https://9yhyi3c8kokl.manus.space)
🔗 **Live Demo**: [Another Demo](https://lnh8imcnke0p.manus.space/)

---

## 🚀 Project Scope
- Detects **text-based scams** (emails, SMS, social media messages).  
- Focus on **Ethiopia-specific scams** such as **Telebirr fraud, SIM swap, wangiri fraud, phishing, and romance scams**.  
- Provides **real-time detection (<1 second)** with explainable outputs.  
- Privacy-compliant and designed for individuals, small businesses, and organizations.  

## ✨ Features
- ✅ Scam vs Legit classification with **confidence score**  
- ✅ **Explainable AI outputs** (highlights scam indicators)  
- ✅ Real-time detection via **web app / API**  
- ✅ **User feedback loop** for continuous model improvement  
- ✅ **Blacklist/Whitelist management** (e.g., scam numbers, URLs)  
- ✅ **Dashboard & reporting** for scam trends  

## 🔍 Scam Types Detected
The tool is optimized to detect 8 high-priority scam categories in Ethiopia:  

1. **Social Engineering** – Fake Ethio Telecom/bank messages requesting PINs  
2. **SIM Swap (Simjacking)** – Fraudulent SIM upgrade requests  
3. **Wangiri Fraud** – Missed international call scams  
4. **Mobile Money Fraud (Telebirr)** – Fake transfer/OTP requests  
5. **Phishing (Email/SMS)** – Credential-stealing messages  
6. **Advance-Fee Scams (419)** – “Lottery/prize” frauds requiring upfront fees  
7. **Lottery Scams** – Fake winnings & payment requests  
8. **Romance Scams** – Emotional manipulation for financial gain  

## 🏗️ System Architecture
- **Input Layer**: SMS/Email text submitted via web app or API  
- **Preprocessing**: Tokenization, stopword removal, TF-IDF/embeddings  
- **ML Models**: Fine-tuned **BERT** + lightweight fallback models (Logistic Regression, Random Forest)  
- **Rules Engine**: Keyword & blacklist checks  
- **Output**: Scam/Legit label + probability + explanation  
- **Feedback & Dashboard**: User error reports + scam trend analytics  

## 🛠️ Tech Stack
- **Programming Language**: Python  
- **ML Libraries**: PyTorch, scikit-learn, Hugging Face Transformers  
- **NLP Tools**: spaCy, NLTK  
- **Web Frameworks**: Flask (API), Streamlit (UI)  
- **Deployment**: Render / Railway / Fly.io  
- **Monitoring**: Prometheus + Grafana  
- **Version Control**: Git + GitHub  

## 📊 Evaluation & Metrics
- Target **>85% precision and recall**  
- Benchmarked using public datasets (Kaggle, Enron) + Ethiopia-specific data (Telebirr fraud samples)  
- Continuous retraining against **model drift** and evolving scams  

## ⚠️ Risk Mitigation
- **False positives/negatives** → feedback loop retraining  
- **Limited Ethiopian datasets** → synthetic data + crowdsourced labeling  
- **Privacy concerns** → encrypted storage & user consent  
- **Model drift** → periodic retraining & monitoring  

## 📅 Project Roadmap
| Week | Task                          | Status |
|------|-------------------------------|--------|
| 1    | Research & Planning           | ✅ Done |
| 2    | Data Collection & Preprocessing |✅ Done|
| 3–4  | Model Development (BERT Tuning) | 🔜 In Progress  |
| 5    | Integration & Implementation  | 🔜 Pending |
| 6    | Testing & Deployment          | 🔜 Pending |
| 7    | Final Review & Documentation  | 🔜 Pending |

## 📌 Future Extensions
- 🔹 Support for **Amharic & for  other Ethiopian languages**  
- 🔹 Image-based scam detection (fake websites, deepfakes)  
- 🔹 Mobile app integration for **offline scam checking**  



---
