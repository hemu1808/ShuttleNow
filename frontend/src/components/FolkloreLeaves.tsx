import { motion } from 'framer-motion';

const LeafSVG = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
    <path d="M21.0002 3C21.0002 3 15.0002 3 11.0002 9C6.99976 15 3.00049 14.9996 3.00049 14.9996C3.00049 14.9996 8.50021 16.5 12.5002 12.5C16.5002 8.5 21.0002 3 21.0002 3Z" stroke="none" />
    <path d="M12.5 12.5L3 21" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
  </svg>
);

export default function FolkloreLeaves() {
  // Generate random positions
  const leaves = [...Array(10)].map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 5,
    duration: 10 + Math.random() * 10,
  }));

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {leaves.map((leaf) => (
        <motion.div
          key={leaf.id}
          className="absolute text-emerald-600/20 dark:text-emerald-400/10"
          initial={{ y: -100, x: 0, opacity: 0, rotate: 0 }}
          animate={{ 
            y: "120vh", 
            x: [0, 50, -50, 0], // sway
            opacity: [0, 1, 1, 0], 
            rotate: 360 
          }}
          transition={{
            duration: leaf.duration,
            repeat: Infinity,
            delay: leaf.delay,
            ease: "linear",
          }}
          style={{ left: leaf.left }}
        >
          <LeafSVG />
        </motion.div>
      ))}
    </div>
  );
}