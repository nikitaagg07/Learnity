import { useState } from "react";

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { text: "Hi! 👋 I'm your AI assistant. How can I help you today?", sender: "bot" },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: "user" };
    setMessages((prev) => [...prev, userMessage]);

    setTimeout(() => {
      const botMessage = { text: getBotResponse(input), sender: "bot" };
      setMessages((prev) => [...prev, botMessage]);
    }, 500);

    setInput("");
  };

  const getBotResponse = (userInput) => {
    userInput = userInput.toLowerCase();

    if (userInput.includes("enroll") || userInput.includes("join")) {
      return "To enroll, go to the Courses section, choose a course, and complete the payment.";
    }
    if (userInput.includes("certificate")) {
      return "Certificates are issued automatically after you complete a course and pass the assessments.";
    }
    if (userInput.includes("quiz")) {
      return "Quizzes are short tests available under each course. Attempt them after completing lessons.";
    }
    if (userInput.includes("live") || userInput.includes("lecture")) {
      return "Live lectures are scheduled events. Check your dashboard to see upcoming sessions.";
    }
    if (userInput.includes("ai proctored") || userInput.includes("exam")) {
      return "AI Proctored Exams ensure fairness. You'll need a working camera and microphone during exams.";
    }
    if (userInput.includes("what is this") || userInput.includes("platform")) {
      return "This platform offers online courses, live sessions, quizzes, and certifications.";
    }
    if (userInput.includes("support") || userInput.includes("help")) {
      return "For support, please email support@yourplatform.com or visit the Help Center.";
    }
    if (userInput.includes("reset password") || userInput.includes("forgot password")) {
      return "To reset your password, click on 'Forgot Password' on the login page and follow the steps.";
    }
    if (userInput.includes("instructor") || userInput.includes("teacher")) {
      return "Instructors are qualified experts who create and deliver course content.";
    }
    if (userInput.includes("refund") || userInput.includes("cancel payment")) {
      return "Refunds depend on the course policy. Please check the specific course page for refund rules.";
    }
    if (userInput.includes("certificate verification")) {
      return "Each certificate has a unique URI link. You or others can verify it by accessing the link.";
    }

    return "I'm sorry, I couldn't understand that. Please try asking differently or contact support.";
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSend();
    }
  };

  const styles = {
    wrapper: {
      height: "100vh",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "#f0f2f5",
    },
    container: {
      width: "600px",
      padding: "20px",
      backgroundColor: "#fff",
      borderRadius: "10px",
      boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
      fontFamily: "Arial, sans-serif",
      outline: "4px solid #4A90E2",
      outlineOffset: "10px",
    },
    header: {
      textAlign: "center",
      fontSize: "22px",
      fontWeight: "bold",
      marginBottom: "15px",
    },
    chatBox: {
      height: "300px",
      overflowY: "auto",
      border: "1px solid #ddd",
      padding: "10px",
      borderRadius: "5px",
      backgroundColor: "#f8f8f8",
      marginBottom: "10px",
    },
    messageContainer: {
      marginBottom: "8px",
    },
    userMessage: {
      textAlign: "right",
    },
    botMessage: {
      textAlign: "left",
    },
    messageBubble: {
      display: "inline-block",
      padding: "8px 12px",
      borderRadius: "12px",
      maxWidth: "80%",
    },
    userBubble: {
      backgroundColor: "#d0ebff",
    },
    botBubble: {
      backgroundColor: "#d3f9d8",
    },
    inputContainer: {
      display: "flex",
      gap: "10px",
    },
    input: {
      flex: 1,
      padding: "10px",
      borderRadius: "5px",
      border: "1px solid #ccc",
    },
    button: {
      padding: "10px 16px",
      borderRadius: "5px",
      border: "none",
      backgroundColor: "#3498db",
      color: "#fff",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.container}>
        <h1 style={styles.header}>AI Chatbot 🤖</h1>
        <div style={styles.chatBox}>
          {messages.map((msg, index) => (
            <div
              key={index}
              style={{
                ...styles.messageContainer,
                ...(msg.sender === "user" ? styles.userMessage : styles.botMessage),
              }}
            >
              <span
                style={{
                  ...styles.messageBubble,
                  ...(msg.sender === "user" ? styles.userBubble : styles.botBubble),
                }}
              >
                {msg.text}
              </span>
            </div>
          ))}
        </div>
        <div style={styles.inputContainer}>
          <input
            type="text"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            style={styles.input}
          />
          <button onClick={handleSend} style={styles.button}>
            Send
          </button>
        </div>
      </div>
    </div>
  );
}