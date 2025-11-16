import { motion } from "framer-motion";

const DemoBadge = () => {
  return (
    <>
      {/* Corner Ribbon */}
      <div className="fixed top-0 right-0 z-50 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="relative"
        >
          <div className="absolute top-0 right-0 w-32 h-32">
            <div className="absolute transform rotate-45 bg-gradient-to-r from-red-600 to-red-500 text-white text-center font-bold py-1 right-[-40px] top-[25px] w-[170px] shadow-lg">
              DEMO
            </div>
          </div>
        </motion.div>
      </div>

      {/* Floating Badge - Bottom Right */}
      <motion.div
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
        className="fixed bottom-6 right-6 z-40 pointer-events-none"
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 0 0 rgba(234, 179, 8, 0.7)",
              "0 0 0 10px rgba(234, 179, 8, 0)",
              "0 0 0 0 rgba(234, 179, 8, 0)",
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
          }}
          className="bg-gradient-to-br from-yellow-400 via-amber-500 to-orange-500 text-black px-4 py-2 rounded-full font-bold text-sm shadow-2xl border-2 border-yellow-300"
        >
          DEMO MODE
        </motion.div>
      </motion.div>

      {/* Watermark - Center */}
      <div className="fixed inset-0 z-30 pointer-events-none flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.01 }}
          transition={{ delay: 0.7 }}
          className="text-9xl font-black text-foreground transform rotate-[-25deg] select-none"
        >
          DEMO
        </motion.div>
      </div>
    </>
  );
};

export default DemoBadge;
