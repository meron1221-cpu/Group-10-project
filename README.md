
# 🔐 Intrusion Detection System (IDS) – AI Upgradable

## 📘 Overview

This project is a foundational **Intrusion Detection System (IDS)** built using Python to monitor and analyze live network traffic for suspicious or malicious activity. It is designed as an entry-level cybersecurity tool, with future plans to integrate **AI-based anomaly detection**.

The current version implements a **rule-based detection system**, which serves as a stepping stone for learning and eventually upgrading to a machine learning-powered IDS.

---

## 🎯 Project Goals

- Develop a basic, functioning IDS using Python.
- Detect common types of network attacks such as:
  - Port scanning
  - ICMP flooding
  - Abnormal packet frequency
- Log alerts and store suspicious event records.
- Gain hands-on experience in cybersecurity and networking.
- Design a system architecture that is **AI-upgradable**.

---

## 🧩 System Architecture

```
[Live Network Traffic]
        ↓
 [Packet Sniffer (Scapy)]
        ↓
 [Rule-based Detection Engine]
        ↓
[Log Handler] → [Alerts / Reports]
```

**AI Upgrade Path (Planned):**
```
        ↓
 [Feature Extractor]
        ↓
 [ML Model (AI-based Detection)]
        ↓
[Alert Generator]
```

---

## 🛠️ Technologies Used

| Area             | Tools / Libraries                        |
|------------------|-------------------------------------------|
| Programming      | Python 3.x                                |
| Packet Sniffing  | Scapy, pyshark                            |
| Logging          | Python logging module                     |
| Visualization    | (Optional) Matplotlib / CLI alerts        |
| Dataset (Future) | NSL-KDD, CICIDS2017 (for AI upgrade)      |
| ML Libraries     | scikit-learn, pandas, numpy (for AI phase)|
| OS/Environment   | Linux (Ubuntu preferred)                  |

---

## 📂 Project Structure

```
/IDS-Project
│
├── main.py               # Main IDS logic: sniffer + rule engine
├── detection_rules.py    # Custom detection logic
├── logger.py             # Logging utility
├── alerts.log            # Stores alert messages
├── README.md             # Project documentation
└── /ml_model             # (Optional AI phase files)
    ├── train_model.py
    ├── model.pkl
    └── feature_extractor.py
```

---

## 🚦 How It Works (Basic IDS)

1. Captures live network packets using a sniffer.
2. Applies basic rules to identify malicious patterns.
3. Triggers alerts based on:
   - Excessive connection attempts
   - Rapid ICMP requests
   - Unusual port access
4. Logs alerts to a file for analysis or monitoring.

---

## 🔍 Example Detection Rules

- **Port Scan Detection**: Multiple SYN packets to different ports from the same IP within a short interval.
- **ICMP Flood Detection**: High volume of ICMP packets in a short time.
- **Unauthorized Port Access**: Connections targeting restricted or inactive ports.

---

## 🚀 Future Upgrade: AI-Enhanced IDS

Our long-term goal is to enhance this system using **machine learning**, enabling detection of unknown threats and reducing false positives.

Future enhancements will include:
- Feature extraction from live traffic
- Model training on labeled datasets (e.g., NSL-KDD)
- Real-time AI-based anomaly detection
- Adaptive alert generation

---

## 👨‍💻 Collaborators

| Name (Alphabetical) | Email Address               |
|---------------------|-----------------------------|
| Aphran Mohammed     | aphratuss@gmail.com         |
| Dawit Addis         | dawitaddis527@gmail.com     |
| Meron Nisrane       | meronnisrane@gmail.com      |
| Nahom Anon          | nahooman00@gmail.com        |
| Wolfman WF          | wolfmanwf472@gmail.com      |

---

## 🧪 Testing Tools

| Purpose            | Tool        |
|--------------------|-------------|
| Port Scanning      | Nmap        |
| ICMP Flood Attack  | Hping3      |
| Packet Inspection  | Wireshark   |
| Brute Force Login  | Hydra       |

> All testing is conducted in isolated virtual environments to ensure safety and legality.

---

## ⚠️ Disclaimer

This project is for **educational and academic purposes only**.  
Do not deploy or test this tool on public, production, or unauthorized networks.  
The authors are not responsible for any misuse or damage caused by improper usage.

---
