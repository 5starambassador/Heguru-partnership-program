"use client";

import { useEffect, useRef } from "react";
import { Star, Lightbulb, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export const BrandSidebar = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = (canvas.width = canvas.offsetWidth);
      height = (canvas.height = canvas.offsetHeight);
    };
    window.addEventListener("resize", handleResize);

    // Plexus / Neural Network Particles configuration
    const particleCount = 45;
    const particles: Array<{
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
    }> = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4, // Slow, elegant drifting speed
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1.5,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw & Update particles (Neural nodes)
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce nodes off margins
        if (p.x < 0 || p.x > width) p.vx *= -1;
        if (p.y < 0 || p.y > height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(156, 163, 175, 0.45)"; // Soft gray node
        ctx.fill();
      });

      // Draw connection lines (Gray plexus mesh)
      const connectionDistance = 115;
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectionDistance) {
            // Stronger opacity for closer nodes
            const alpha = (1 - dist / connectionDistance) * 0.28;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(156, 163, 175, ${alpha})`; // Gray lines
            ctx.lineWidth = 0.85;
            ctx.stroke();
          }
        }
      }

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="hidden lg:flex flex-col items-center justify-center w-1/2 min-h-screen relative overflow-hidden p-12 border-r border-[var(--warm-gray)]">
      {/* Background Image of the Sidebar with Primary Orange to White Gradient Overlay */}
      <div
        className="absolute inset-0 z-0 bg-contain bg-no-repeat bg-right opacity-[0.22]"
        style={{
          backgroundImage: `linear-gradient(135deg, rgba(242, 110, 33, 0.25) 0%, rgba(255, 255, 255, 0.6) 55%, rgba(255, 255, 255, 0.95) 100%)`,
        }}
      ></div>

      {/* HTML5 Canvas for Neural Network Plexus Animation */}
      <canvas
        ref={canvasRef}
        className="absolute inset-0 w-full h-full pointer-events-none z-1"
      />

      {/* Hovering 3D Glassmorphic Bulb */}
      {/* <motion.div
        className="absolute top-[20%] left-[10%] w-16 h-16 pointer-events-none z-10 flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/60 rounded-2xl shadow-[0_8px_32px_rgba(242,110,33,0.15),inset_0_4px_8px_rgba(255,255,255,0.6)]"
        animate={{
          y: [0, -12, 0],
          rotate: [0, 8, -8, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-tr from-[var(--primary-orange)]/40 to-transparent blur-md opacity-70"></div>
        <Lightbulb
          size={28}
          className="text-[var(--primary-orange)] fill-[var(--primary-orange)]/10 drop-shadow-[0_0_10px_rgba(242,110,33,0.6)] relative z-10"
        />
      </motion.div> */}

      {/* Hovering 3D Sparkle */}
      {/* <motion.div
        className="absolute bottom-[25%] left-[8%] w-12 h-12 pointer-events-none z-10 flex items-center justify-center bg-white/40 backdrop-blur-md border border-white/60 rounded-full shadow-[0_8px_32px_rgba(59,130,246,0.15),inset_0_4px_8px_rgba(255,255,255,0.6)]"
        animate={{
          y: [0, 15, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
       
        <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[var(--learning-blue)]/40 to-transparent blur-md opacity-70"></div>
        <Sparkles
          size={20}
          className="text-[var(--learning-blue)] drop-shadow-[0_0_8px_rgba(59,130,246,0.6)] relative z-10"
        />
      </motion.div> */}

      {/* Animative spark particles */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <motion.div
          className="absolute w-2 h-2 rounded-full bg-[var(--primary-orange)]"
          style={{ top: "40%", left: "15%" }}
          animate={{
            y: [0, -40, 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [0.8, 1.2, 0.8],
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div
          className="absolute w-3 h-3 rounded-full bg-amber-400"
          style={{ top: "70%", left: "25%" }}
          animate={{
            y: [0, -60, 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.3, 1],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </div>

      {/* Centered Content */}
      <div className="relative z-20 flex flex-col items-center text-center space-y-6 max-w-md my-auto">
        {/* Brand Header / Logo */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="relative inline-block group">
            <div className="absolute inset-0 bg-[var(--primary-orange)]/10 blur-xl rounded-full opacity-50"></div>
            <img
              src="/images/HEGURU-JAPAN-LOGO.jpeg"
              alt="Heguru Japan Logo"
              className="h-32 w-auto rounded-md border border-[var(--warm-gray)] shadow-sm relative z-10"
            />
          </div>
        </motion.div>

        {/* Subheadings and Badges */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.6 }}
          className="flex flex-col items-center gap-2"
        >
          <p className="text-[15px] text-[var(--text-gray)] font-bold uppercase tracking-[0.2em]">
            HEGURU Partnership Program
          </p>
        </motion.div>

        {/* Main Heading & Paragraph */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.6 }}
          className="space-y-4 flex flex-col items-center"
        >
          <h1 className="text-5xl font-black tracking-tighter leading-[1.1] text-[var(--deep-black)] font-heading">
            Developing{" "}
            <span className="text-[var(--primary-orange)]">Brighter</span>{" "}
            <br />
            Minds for a Better Future
          </h1>

          <p className="text-[var(--text-gray)] text-base leading-relaxed max-w-3xl">
            Join an elite community of partners committed to shaping and
            securing the future of education by empowering minds and enriching
            lives.
          </p>
        </motion.div>
      </div>
    </div>
  );
};
