import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FlipFadeText } from './ui/flip-fade-text';
import './IntroOverlay.css';

interface IntroOverlayProps {
    onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
    const [counter, setCounter] = useState(0);
    const [phase, setPhase] = useState<'loading' | 'ready' | 'hud' | 'exiting'>('loading');
    const [hudPhase, setHudPhase] = useState<'none' | 'authorized' | 'scanning' | 'branding'>('none');
    const [resizeStep, setResizeStep] = useState<'normal' | 'small' | 'final'>('normal');
    const [isHovered, setIsHovered] = useState(false);
    const [visibleElements, setVisibleElements] = useState({
        bottom: false,
        top: false,
        circle: false
    });
    const [glitchText, setGlitchText] = useState({
        portfolio: 'PORTFOLIO',
        overview: 'OVERVIEW:'
    });
    const [hudData, setHudData] = useState({
        os: 'MACINTOSH',
        browser: 'SAFARI 16.4.1',
        binary: '3AEE  01  2000'
    });

    const containerRef = useRef<HTMLDivElement>(null);

    // Staggered Entry Sequence
    useEffect(() => {
        const sequence = async () => {
            await new Promise(r => setTimeout(r, 500));
            setVisibleElements(prev => ({ ...prev, bottom: true }));
            
            await new Promise(r => setTimeout(r, 800));
            setVisibleElements(prev => ({ ...prev, top: true }));
            
            await new Promise(r => setTimeout(r, 800));
            setVisibleElements(prev => ({ ...prev, circle: true }));
        };
        sequence();
    }, []);

    // Counter and Glitch Logic
    useEffect(() => {
        if (phase !== 'loading' || !visibleElements.circle) return;

        let startTime = Date.now();
        const duration = 7000;

        const update = () => {
            const now = Date.now();
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const easedProgress = progress < 0.5 
                ? 2 * progress * progress 
                : 1 - Math.pow(-2 * progress + 2, 2) / 2;

            setCounter(Math.floor(easedProgress * 100));

            if (elapsed > 3000 && elapsed < 4000) {
                if (Math.random() > 0.8) {
                    setGlitchText({
                        portfolio: Math.random() > 0.5 ? 'PORTFƏLIO' : 'PORTFOLTO',
                        overview: Math.random() > 0.5 ? 'OVFRVTFW-' : '0V3RV13W'
                    });
                }
            } else {
                setGlitchText({ portfolio: 'PORTFOLIO', overview: 'OVERVIEW:' });
            }

            if (progress < 1) {
                requestAnimationFrame(update);
            } else {
                // Dynamic Resize Animation: 100% -> 70% -> 75%
                setTimeout(() => {
                    setResizeStep('small');
                    setTimeout(() => {
                        setResizeStep('final');
                        setPhase('ready');
                    }, 400);
                }, 500);
            }
        };

        requestAnimationFrame(update);

        const userAgent = navigator.userAgent;
        let os = 'UNKNOWN OS';
        if (userAgent.indexOf('Win') !== -1) os = 'WINDOWS';
        if (userAgent.indexOf('Mac') !== -1) os = 'MACINTOSH';
        if (userAgent.indexOf('Linux') !== -1) os = 'LINUX';

        let browser = 'UNKNOWN BROWSER';
        if (userAgent.indexOf('Chrome') !== -1) browser = 'CHROME';
        else if (userAgent.indexOf('Safari') !== -1) browser = 'SAFARI';
        else if (userAgent.indexOf('Firefox') !== -1) browser = 'FIREFOX';

        setHudData(prev => ({ ...prev, os, browser }));

    }, [phase, visibleElements.circle]);

    const handleEnter = () => {
        setPhase('hud');
        // HUD Sequence
        setTimeout(() => setHudPhase('authorized'), 500);
        setTimeout(() => setHudPhase('scanning'), 1500);
        setTimeout(() => setHudPhase('branding'), 2500);
        
        setTimeout(() => {
            setPhase('exiting');
            setTimeout(() => {
                onComplete();
            }, 1200);
        }, 4500);
    };

    // --- TWEAKABLE CONSTANTS ---
    const baseRadius = 200; // Original circle size
    
    // Resize steps (multipliers of baseRadius)
    const resizeSmallMult = 0.7;  // 70%
    const resizeFinalMult = 0.75; // 75%
    
    // Hover offsets (added/subtracted from current radius)
    const outerHoverOffset = -10; // Outer circle shrinks by 10px on hover
    const innerHoverOffset = 30;  // Inner circle expands by 15px on hover
    // ---------------------------

    // Size Logic
    let currentRadius = baseRadius;
    if (resizeStep === 'small') currentRadius = baseRadius * resizeSmallMult;
    else if (resizeStep === 'final') currentRadius = baseRadius * resizeFinalMult;

    // Hover Modulations (Only active when phase is 'ready')
    const canHover = phase === 'ready';
    const outerRadius = (isHovered && canHover) ? currentRadius + outerHoverOffset : currentRadius;
    const innerRadius = (isHovered && canHover) ? (currentRadius - 15) + innerHoverOffset : currentRadius - 15;

    const circumference = 2 * Math.PI * outerRadius;
    const dashOffset = circumference - (counter / 100) * circumference;

    return (
        <div className={`intro-overlay ${phase === 'exiting' ? 'panels-exiting' : ''}`} ref={containerRef}>
            <div className="panel panel-left" />
            <div className="panel panel-right" />

            {phase !== 'hud' && phase !== 'exiting' && (
                <div className="loader-container">
                    <div className={`corner-top-left hud-text bright ${visibleElements.top ? 'visible' : ''}`}>
                        {phase === 'loading' ? counter : (
                            <FlipFadeText 
                                words={["READY","READY","READY"]}
                                interval={1500}
                                letterDuration={0.3}
                                staggerDelay={0.05}
                                exitStaggerDelay={0.02}
                            />
                        )}
                    </div>

                    <div className={`corner-bottom-left hud-text ${visibleElements.bottom ? 'visible' : ''}`}>
                        AMINE ZEGMOU<br />
                        {glitchText.portfolio}
                    </div>

                    <div className={`bottom-center hud-text ${visibleElements.bottom ? 'visible' : ''}`}>
                        {glitchText.overview}<br />
                        08 PROJECTS
                    </div>

                    <div className={`corner-bottom-right hud-text ${visibleElements.bottom ? 'visible' : ''}`}>
                        <span className="status-rect" />
                        V-002
                    </div>

                    <div 
                        className={`loader-circle-container ${visibleElements.circle ? 'visible' : ''}`}
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <svg className="loader-svg" viewBox="0 0 400 400">
                            <circle 
                                className="loader-circle-bg" 
                                cx="200" cy="200" r={outerRadius} 
                            />
                            {phase === 'loading' && (
                                <circle 
                                    className="loader-circle-sweep" 
                                    cx="200" cy="200" r={outerRadius}
                                    strokeDasharray={circumference}
                                    strokeDashoffset={dashOffset}
                                />
                            )}
                            {(phase === 'loading' || phase === 'ready') && (
                                <circle 
                                    className="inner-dashed-circle" 
                                    cx="200" cy="200" r={innerRadius} 
                                />
                            )}
                        </svg>

                        {phase === 'loading' ? (
                            <div className="logo-mark" style={{ transform: counter === 100 ? 'scale(1.1)' : 'scale(1)' }}><img src="logo.png" alt="RHODIUM"></img></div>
                        ) : (
                            <button 
                                className="enter-button"
                                onClick={handleEnter}
                            >
                                ENTER
                            </button>
                        )}
                    </div>
                </div>
            )}

            {(phase === 'hud' || phase === 'exiting') && (
                <>
                    <div className="hud-frame visible">
                        <div className="slashes-row">
                            {"////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////"}
                        </div>
                        
                        <div className="hud-top-bar">
                            <div className="hud-text bright visible">
                                {hudData.binary}
                            </div>
                            <div className="hud-text visible" style={{ textAlign: 'center' }}>
                                PARIS GMT +1<br />
                                48.866667°N, 2.333333°E
                            </div>
                            <div className="hud-text visible">
                                {hudData.os}<br />
                                {hudData.browser}
                            </div>
                            <div className="hud-text bright visible">
                                [ a ] 100101 00 011101 001
                            </div>
                        </div>

                        <div className="hud-side-dots" style={{ left: 0 }}>
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="dot" style={{ transitionDelay: `${i * 50}ms` }} />)}
                        </div>
                        <div className="hud-side-dots" style={{ right: 0 }}>
                            {[1, 2, 3, 4, 5].map(i => <div key={i} className="dot" style={{ transitionDelay: `${i * 50}ms` }} />)}
                        </div>

                        <div className="hud-bottom-bar">
                            <div className="hud-text visible">IIINTERFACE</div>
                            <div className="hud-text visible">
                                100101 <span className="text-red">00</span> 011101 <span className="text-red">00</span> 001
                            </div>
                            <div className="hud-text visible">60.0-250.0 HZ</div>
                            <div className="hud-text visible text-green">BOOT COMPLETE / EXECUTE PROGRAM</div>
                            <div className="hud-text visible">EXIT LOADER / RRRRUNTIME → HOME <span style={{ marginLeft: '10px' }}>STM</span></div>
                        </div>

                        <div className="intro-screen-box">
                            <div className={`corner-top-left hud-text bright visible`} style={{ margin: '20px' }}>
                                READY
                            </div>

                            <div className={`authorized-access ${hudPhase !== 'none' ? 'visible' : ''}`}>
                                AUTHORIZED ACCESS
                            </div>

                            {hudPhase === 'scanning' && (
                                <>
                                    <motion.div 
                                        className="scan-bar"
                                        initial={{ right: '-10%' }}
                                        animate={{ right: '110%' }}
                                        transition={{ duration: 1.2, ease: "linear", repeat: Infinity }}
                                    />
                                    <motion.div 
                                        className="glitch-cursor"
                                        animate={{ 
                                            x: [0, 50, -30, 80, 0],
                                            y: [0, -40, 60, -20, 0],
                                            opacity: [1, 0.8, 1, 0.5, 1]
                                        }}
                                        transition={{ duration: 0.2, repeat: Infinity }}
                                        style={{ top: '50%', left: '50%' }}
                                    />
                                </>
                            )}

                            {hudPhase === 'branding' && (
                                <div className="glitch-branding">
                                    {[ "A", "Δ", "A" ].map((char, i) => (
                                        <motion.div 
                                            key={i}
                                            className="glitch-letter"
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ 
                                                opacity: 1, 
                                                scale: 1,
                                                x: [0, -2, 2, -1, 0],
                                                y: [0, 1, -1, 2, 0],
                                            }}
                                            transition={{ 
                                                duration: 0.1, 
                                                delay: i * 0.1,
                                                x: { repeat: Infinity, duration: 0.1, repeatType: "mirror" },
                                                y: { repeat: Infinity, duration: 0.15, repeatType: "mirror" }
                                            }}
                                        >
                                            {char}
                                        </motion.div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default IntroOverlay;
