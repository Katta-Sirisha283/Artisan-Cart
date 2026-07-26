import { useState } from 'react';
import * as api from '../api';

export default function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { from: 'bot', text: "Hi! I'm here to help with sizing, shipping, or returns questions." },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);

  const send = async () => {
    if (!input.trim()) return;
    const userMessage = { from: 'user', text: input };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.sendChatMessage(userMessage.text);
      setMessages((prev) => [...prev, { from: 'bot', text: res.data.reply }]);
    } catch (e) {
      setMessages((prev) => [...prev, { from: 'bot', text: 'Sorry, something went wrong. Please try again.' }]);
    } finally {
      setLoading(false);
    }
  };

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} style={styles.launcher}>
        💬 Chat
      </button>
    );
  }

  return (
    <div style={styles.panel}>
      <div style={styles.header}>
        <span>Support</span>
        <button onClick={() => setOpen(false)} style={styles.closeBtn}>×</button>
      </div>
      <div style={styles.messages}>
        {messages.map((m, i) => (
          <div key={i} style={m.from === 'user' ? styles.userMsg : styles.botMsg}>
            {m.text}
          </div>
        ))}
        {loading && <div style={styles.botMsg}>Typing…</div>}
      </div>
      <div style={styles.inputRow}>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && send()}
          placeholder="Ask a question..."
          style={styles.input}
        />
        <button onClick={send} style={styles.sendBtn}>Send</button>
      </div>
    </div>
  );
}

const styles = {
  launcher: {
    position: 'fixed', bottom: '1.5rem', right: '1.5rem',
    background: '#3d3229', color: '#fff', border: 'none',
    borderRadius: '999px', padding: '0.75rem 1.25rem', cursor: 'pointer',
    boxShadow: '0 2px 8px rgba(0,0,0,0.2)',
  },
  panel: {
    position: 'fixed', bottom: '1.5rem', right: '1.5rem', width: '320px', height: '420px',
    background: '#fff', border: '1px solid #ddd', borderRadius: '10px',
    display: 'flex', flexDirection: 'column', boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
  },
  header: {
    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
    padding: '0.75rem 1rem', background: '#3d3229', color: '#fff',
    borderTopLeftRadius: '10px', borderTopRightRadius: '10px',
  },
  closeBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' },
  messages: { flex: 1, overflowY: 'auto', padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' },
  userMsg: { alignSelf: 'flex-end', background: '#3d3229', color: '#fff', padding: '0.5rem 0.75rem', borderRadius: '10px', maxWidth: '80%' },
  botMsg: { alignSelf: 'flex-start', background: '#f1ede7', padding: '0.5rem 0.75rem', borderRadius: '10px', maxWidth: '80%' },
  inputRow: { display: 'flex', borderTop: '1px solid #eee' },
  input: { flex: 1, border: 'none', padding: '0.75rem', outline: 'none' },
  sendBtn: { border: 'none', background: '#3d3229', color: '#fff', padding: '0 1rem', cursor: 'pointer' },
};
