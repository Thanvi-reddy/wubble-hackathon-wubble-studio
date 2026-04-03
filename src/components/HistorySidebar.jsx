import React from 'react';
import { History as HistoryIcon, Play } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * COMPONENT: HistorySidebar
 * Displays a persistent list of previous versions.
 */
const HistorySidebar = ({ history, onSelect }) => {
  return (
    <aside className="wubble-sidebar glass">
      <div className="sidebar-header">
        <HistoryIcon size={18} />
        <h3>History</h3>
      </div>
      
      <div className="history-list">
        <AnimatePresence>
          {history.length > 0 ? (
            history.map((h, i) => (
              <motion.div 
                key={h.id || i}
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                className="history-item" 
                onClick={() => onSelect(h)}
              >
                <div className="history-icon-circle">
                  <Play size={14} fill="currentColor" />
                </div>
                <div>
                  <p className="h-title">{h.song_title || h.title}</p>
                  <p className="h-prompt">
                    {h.prompt.substring(0, 35)}...
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <p className="empty-msg">Start creating to record your session history.</p>
          )}
        </AnimatePresence>
      </div>
    </aside>
  );
};

export default HistorySidebar;
