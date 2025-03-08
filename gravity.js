
        document.addEventListener('DOMContentLoaded', () => {
            // Dynamically create and load the Matter.js script tag
            const script = document.createElement('script');
            script.src = 'matter.min.js';
            script.onload = () => {
                const { Engine, Render, Runner, Bodies, Composite, World, Events } = Matter;

                // Create an engine and a runner
                const engine = Engine.create();
                const runner = Runner.create();
                Runner.run(runner, engine);

                // Select all elements in the page and make them fall
                const elements = document.body.querySelectorAll('*');

                elements.forEach(element => {
                    const rect = element.getBoundingClientRect();

                    // Ensure the element has a valid size
                    if (rect.width === 0 || rect.height === 0) return; // Skip empty or hidden elements

                    // Create a Matter.js body for each element
                    const body = Bodies.rectangle(
                        rect.left + rect.width / 2,
                        rect.top + rect.height / 2,
                        rect.width * 0.5,  // Adjust width for better visibility
                        rect.height * 0.5, // Adjust height for better visibility
                        {
                            restitution: 0.8, // Bouncing like jelly
                            friction: 0.1,     // Less friction for smoother movement
                            density: 0.02,     // Lighter for easier movement
                            render: { visible: false } // Make the body invisible
                        }
                    );

                    // Safeguard: Check if the body is valid before adding it to the world
                    if (body && body.id) {
                        // Add the body to the Matter.js world
                        World.add(engine.world, body);

                        // Update the element's position based on the body's physics
                        Events.on(engine, 'afterUpdate', () => {
                            const posX = body.position.x - (rect.width * 0.25);
                            const posY = body.position.y - (rect.height * 0.25);
                            element.style.transform = `translate(${posX}px, ${posY}px) rotate(${body.angle}rad)`;
                        });
                    } else {
                        console.error('Invalid body created for element:', element);
                    }
                });

                // Create invisible boundaries to keep elements on screen
                const boundaries = [
                    Bodies.rectangle(window.innerWidth / 2, window.innerHeight + 25, window.innerWidth, 50, {
                        isStatic: true,
                        render: { visible: false } // Invisible bottom boundary
                    }),
                    Bodies.rectangle(-25, window.innerHeight / 2, 50, window.innerHeight, {
                        isStatic: true,
                        render: { visible: false } // Invisible left boundary
                    }),
                    Bodies.rectangle(window.innerWidth + 25, window.innerHeight / 2, 50, window.innerHeight, {
                        isStatic: true,
                        render: { visible: false } // Invisible right boundary
                    }),
                ];
                World.add(engine.world, boundaries);

                // Handle window resize
                window.addEventListener('resize', () => {
                    Composite.clear(engine.world, false); // Keep elements, but clear previous boundaries
                    World.add(engine.world, boundaries); // Re-add boundaries
                });
            };
            document.head.appendChild(script); // Append the script to the document head
        });
