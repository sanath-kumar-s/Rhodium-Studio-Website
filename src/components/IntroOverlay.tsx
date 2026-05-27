import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';
import { FlipFadeText } from './ui/flip-fade-text';
import './IntroOverlay.css';
import logo from '../assets/logo.png';

interface IntroOverlayProps {
    onComplete: () => void;
}

const IntroOverlay: React.FC<IntroOverlayProps> = ({ onComplete }) => {
    const [counter, setCounter] = useState(0);
    const [phase, setPhase] = useState<'loading' | 'ready' | 'hud' | 'exiting'>('loading');
    const [resizeStep, setResizeStep] = useState<'normal' | 'small' | 'final'>('normal');
    const [isHovered, setIsHovered] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
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

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth <= 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Staggered Entry Sequence
    useEffect(() => {

        const sequence = async () => {

            // MOBILE VERSION
            if (isMobile) {

                // Faster cinematic timing
                await new Promise(r => setTimeout(r, 250));

                setVisibleElements(prev => ({
                    ...prev,
                    circle: true
                }));

                await new Promise(r => setTimeout(r, 180));

                setVisibleElements(prev => ({
                    ...prev,
                    bottom: true
                }));

                await new Promise(r => setTimeout(r, 120));

                setVisibleElements(prev => ({
                    ...prev,
                    top: true
                }));

                // DO NOT instantly finish loader anymore
                // Let the progress animation handle it naturally

                return;
            }

            // DESKTOP VERSION
            await new Promise(r => setTimeout(r, 500));

            setVisibleElements(prev => ({
                ...prev,
                bottom: true
            }));

            await new Promise(r => setTimeout(r, 800));

            setVisibleElements(prev => ({
                ...prev,
                top: true
            }));

            await new Promise(r => setTimeout(r, 800));

            setVisibleElements(prev => ({
                ...prev,
                circle: true
            }));

        };

        sequence();

    }, [isMobile]);

    // Counter and Glitch Logic
    // Counter and Glitch Logic
    // Counter and Glitch Logic
    useEffect(() => {

        if (phase !== 'loading' || !visibleElements.circle)
            return;

        let animationFrame: number;

        // REAL progress
        let currentProgress = 0;

        // MASTER overall speed multiplier
        let animationOverallSpeedMultiplier = 1.4;

        // Current movement speed
        let speedMultiplier = 0.15;

        // Target speed we lerp toward
        let targetSpeed = 0.15;

        // Timing control
        let lastSpeedChange = performance.now();

        const update = () => {

            const now = performance.now();

            // Change target speed occasionally
            if (now - lastSpeedChange > 400 + Math.random() * 1200) {

                // Different progress zones
                if (currentProgress < 15) {

                    // explosive startup
                    targetSpeed =
                        (0.8 + Math.random() * 0.8);

                } else if (currentProgress < 40) {

                    // smooth medium pacing
                    targetSpeed =
                        (0.2 + Math.random() * 0.35);

                } else if (currentProgress < 65) {

                    // intentional slowdowns
                    targetSpeed =
                        (0.08 + Math.random() * 0.22);

                } else if (currentProgress < 85) {

                    // dramatic pacing
                    targetSpeed =
                        (0.04 + Math.random() * 0.14);

                } else if (currentProgress < 95) {

                    // suspense hold
                    targetSpeed =
                        (0.015 + Math.random() * 0.05);

                } else {

                    // ultra cinematic finish
                    targetSpeed =
                        (0.005 + Math.random() * 0.02);
                }

                lastSpeedChange = now;
            }

            // LERP toward target speed
            speedMultiplier +=
                (targetSpeed - speedMultiplier) * 0.045;

            // Actual progress movement
            currentProgress +=
                speedMultiplier * animationOverallSpeedMultiplier;

            // Clamp
            currentProgress = Math.max(
                0,
                Math.min(currentProgress, 100)
            );

            const rounded = Math.floor(currentProgress);

            setCounter(rounded);

            window.dispatchEvent(
                new CustomEvent('loading-progress', {
                    detail: rounded
                })
            );

            // Finish
            if (currentProgress >= 100) {

                setCounter(100);

                window.dispatchEvent(
                    new CustomEvent('loading-progress', {
                        detail: 100
                    })
                );

                setTimeout(() => {

                    setResizeStep('small');

                    setTimeout(() => {

                        setResizeStep('final');
                        setPhase('ready');

                    }, 400);

                }, 500);

                return;
            }

            // Premium glitch timing
            if (rounded > 45 && rounded < 82) {

                if (Math.random() > 0.94) {

                    setGlitchText({
                        portfolio:
                            Math.random() > 0.5
                                ? 'PORTFƏLIO'
                                : 'PORTF0LIO',

                        overview:
                            Math.random() > 0.5
                                ? '0V3RVIEW'
                                : 'OVFRVTFW'
                    });

                }

            } else {

                setGlitchText({
                    portfolio: 'PORTFOLIO',
                    overview: 'OVERVIEW:'
                });

            }

            animationFrame = requestAnimationFrame(update);
        };

        animationFrame = requestAnimationFrame(update);

        // HUD detection
        const userAgent = navigator.userAgent;

        let os = 'UNKNOWN OS';

        if (userAgent.indexOf('Win') !== -1)
            os = 'WINDOWS';

        if (userAgent.indexOf('Mac') !== -1)
            os = 'MACINTOSH';

        if (userAgent.indexOf('Linux') !== -1)
            os = 'LINUX';

        let browser = 'UNKNOWN BROWSER';

        if (userAgent.indexOf('Chrome') !== -1)
            browser = 'CHROME';

        else if (userAgent.indexOf('Safari') !== -1)
            browser = 'SAFARI';

        else if (userAgent.indexOf('Firefox') !== -1)
            browser = 'FIREFOX';

        setHudData(prev => ({
            ...prev,
            os,
            browser
        }));

        return () => cancelAnimationFrame(animationFrame);

    }, [phase, visibleElements.circle]);

    const handleEnter = () => {
        // Trigger fullscreen on mobile for app-like experience if supported
        if (isMobile && document.documentElement.requestFullscreen) {
            document.documentElement.requestFullscreen().catch(err => {
                console.warn(`Fullscreen request failed: ${err.message}`);
            });
        }
        onComplete();
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

            {phase !== 'hud' && phase !== 'exiting' && (
                <div className="loader-container">
                    <div className={`corner-top-left hud-text bright ${visibleElements.top ? 'visible' : ''}`}>
                        {phase === 'loading' ? counter : (
                            <FlipFadeText
                                words={["READY", "READY", "READY"]}
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
                        className={`loader-circle-container ${visibleElements.circle ? 'visible' : ''} ${phase === 'ready' ? 'is-ready' : ''}`}
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
                            <div className="logo-mark" style={{ transform: counter === 100 ? 'scale(0.4)' : 'scale(0.2  )' }}><img src={logo} alt="RHODIUM"></img></div>
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

        </div>
    );
};

export default IntroOverlay;
