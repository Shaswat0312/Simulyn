# Simulyn — Real-Time Chaos Engineering Simulator

Simulyn is a real-time full-stack system designed to simulate API load, inject failures, and analyze system behavior under stress. It enables developers to observe how systems react to concurrent users, latency, and failure rates, with live streaming metrics and persistent history.

---

## Overview

Modern systems fail in unpredictable ways under load. Simulyn helps you simulate, observe, and analyze those failures before they happen in production.

It combines:

- Real-time batch processing  
- WebSocket-based live metrics  
- Persistent simulation history  
- Comparative analysis between runs  

---

## Features

### Real-Time Simulation Engine
- Simulates concurrent users with configurable failure rates and latency  
- Processes requests in batches  

### Live Metrics via WebSockets
- Streams success and failure counts in real-time  
- Updates the UI instantly without polling  

### Persistent History
- Stores batch-wise simulation data in MongoDB  
- Recovers graph state after refresh  

### Interactive Dashboard
- Visualizes success and failure trends  
- Displays live metrics such as success count, failure count, and success rate  

### Comparison Engine
- Compares two simulation runs side-by-side  
- Enables performance analysis across different configurations  

### Circuit Breaker Pattern
- Automatically halts simulation when the failure rate exceeds a configurable threshold  
- Prevents cascading failures and mimics real-world resilience strategies  
- Displays breaker state (CLOSED / TRIPPED) in real-time  


