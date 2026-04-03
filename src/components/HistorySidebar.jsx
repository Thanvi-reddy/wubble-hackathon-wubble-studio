import React from 'react';
import { History, Music, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

/**
 * COMPONENT: HistorySidebar (Stage 15 - Version Indexing)
 * Features v1, v2, v3 automatic indexing for the INDUSTRIAL EVOLUTION TRAIL.
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
            [...history].reverse().map((h, i) => {
              const versionNum = history.length - i;
              return (
                <motion.div 
                  key={i} 
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="history-item"
                  onClick={() => onSelect(h)}
                >
                  <div className="history-info">
                    <strong>{`v${versionNum} - ${h.song_title}`}</strong>
                    <div className="history-meta">
                      <span>RECENT EVOLUTION</span>
                    </div>
                  </div>
                  <ChevronRight size={18} className="item-arrow" />
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default HistorySidebar;
