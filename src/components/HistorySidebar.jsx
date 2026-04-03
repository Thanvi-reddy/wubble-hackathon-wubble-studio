import React from 'react';
import { History, Clock, Music } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * COMPONENT: HistorySidebar (Stage 14 - Winner Level)
 * Industrial history tracker with high-impact onboarding / empty states.
 */
const HistorySidebar = ({ history, onSelect }) => {
  return (
    <div className="wubble-sidebar glass">
      <div className="sidebar-header">
        <History size={20} className="sidebar-icon" />
        <h4>SESSION HISTORY</h4>
      </div>

      <div className="history-list">
        <AnimatePresence>
          {history.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="empty-history"
            >
              <Music size={32} />
              <p>No tracks yet — generate your first soundscape to start your session history.</p>
            </motion.div>
          ) : (
            history.map((h, i) => (
              <motion.div 
                key={i} 
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="history-item"
                onClick={() => onSelect(h)}
              >
                <div className="history-info">
                  <strong>{h.song_title}</strong>
                  <div className="history-meta">
                    <Clock size={12} />
                    <span>RECENT EVOLUTION</span>
                  </div>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistorySidebar;
