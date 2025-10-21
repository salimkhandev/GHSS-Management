// // Install Prompt Handler for GHSS Luqman Banda School Management System
// // This script handles the PWA install prompt without caching

// let deferredPrompt;
// let isInstalled = false;

// // Check if app is already installed
// window.addEventListener("load", () => {
//   // Check if running in standalone mode (installed)
//   if (
//     window.matchMedia("(display-mode: standalone)").matches ||
//     window.navigator.standalone === true
//   ) {
//     isInstalled = true;
//     console.log("GHSS Luqman Banda app is already installed");
//     return;
//   }

//   // Register service worker
//   if ("serviceWorker" in navigator) {
//     navigator.serviceWorker
//       .register("/sw.js")
//       .then((registration) => {
//         console.log("Service Worker registered successfully:", registration);
//       })
//       .catch((error) => {
//         console.log("Service Worker registration failed:", error);
//       });
//   }

//   // Listen for the beforeinstallprompt event
//   window.addEventListener("beforeinstallprompt", (e) => {
//     console.log("beforeinstallprompt event fired");

//     // Prevent the mini-infobar from appearing on mobile
//     e.preventDefault();

//     // Stash the event so it can be triggered later
//     deferredPrompt = e;

//     // Show install button
//     showInstallButton();
//   });

//   // Listen for the appinstalled event
//   window.addEventListener("appinstalled", (evt) => {
//     console.log("GHSS Luqman Banda app was installed");
//     isInstalled = true;
//     hideInstallButton();
//   });
// });

// // Function to show install button
// function showInstallButton() {
//   // Create install button if it doesn't exist
//   let installButton = document.getElementById("install-button");

//   if (!installButton && !isInstalled) {
//     installButton = document.createElement("button");
//     installButton.id = "install-button";
//     installButton.innerHTML = `
//       <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="min-width: 20px;">
//         <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
//         <polyline points="7,10 12,15 17,10"/>
//         <line x1="12" y1="15" x2="12" y2="3"/>
//       </svg>
//       <span>Install App</span>
//     `;

//     // Styling with inline styles for better compatibility
//     installButton.style.cssText = `
//       position: fixed;
//       bottom: 20px;
//       right: 20px;
//       background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%);
//       color: white;
//       padding: 12px 20px;
//       border: none;
//       border-radius: 12px;
//       box-shadow: 0 4px 12px rgba(30, 60, 114, 0.4);
//       display: flex;
//       align-items: center;
//       gap: 8px;
//       font-family: 'Poppins', sans-serif;
//       font-size: 14px;
//       font-weight: 600;
//       cursor: pointer;
//       z-index: 9999;
//       transition: all 0.3s ease;
//       animation: slideIn 0.5s ease-out;
//     `;

//     // Add hover effect
//     installButton.addEventListener("mouseenter", () => {
//       installButton.style.background =
//         "linear-gradient(135deg, #2a5298 0%, #1e3c72 100%)";
//       installButton.style.transform = "translateY(-2px)";
//       installButton.style.boxShadow = "0 6px 16px rgba(30, 60, 114, 0.5)";
//     });

//     installButton.addEventListener("mouseleave", () => {
//       installButton.style.background =
//         "linear-gradient(135deg, #1e3c72 0%, #2a5298 100%)";
//       installButton.style.transform = "translateY(0)";
//       installButton.style.boxShadow = "0 4px 12px rgba(30, 60, 114, 0.4)";
//     });

//     // Add click event listener
//     installButton.addEventListener("click", installApp);

//     // Add animation keyframes
//     const style = document.createElement("style");
//     style.textContent = `
//       @keyframes slideIn {
//         from {
//           opacity: 0;
//           transform: translateY(20px);
//         }
//         to {
//           opacity: 1;
//           transform: translateY(0);
//         }
//       }

//       @media (max-width: 640px) {
//         #install-button {
//           bottom: 16px !important;
//           right: 16px !important;
//           padding: 10px 16px !important;
//           font-size: 13px !important;
//         }

//         #install-button svg {
//           width: 18px !important;
//           height: 18px !important;
//         }
//       }
//     `;
//     document.head.appendChild(style);

//     // Add to body
//     document.body.appendChild(installButton);
//   }
// }

// // Function to hide install button
// function hideInstallButton() {
//   const installButton = document.getElementById("install-button");
//   if (installButton) {
//     installButton.style.animation = "slideOut 0.3s ease-out";
//     setTimeout(() => {
//       installButton.remove();
//     }, 300);
//   }
// }

// // Function to trigger the install prompt
// async function installApp() {
//   if (!deferredPrompt) {
//     console.log("No install prompt available");
//     return;
//   }

//   // Show the install prompt
//   deferredPrompt.prompt();

//   // Wait for the user to respond to the prompt
//   const { outcome } = await deferredPrompt.userChoice;

//   console.log(`User response to the install prompt: ${outcome}`);

//   // Clear the deferredPrompt
//   deferredPrompt = null;

//   // Hide the install button
//   hideInstallButton();
// }

// // Export functions for global access
// window.installApp = installApp;
// window.showInstallButton = showInstallButton;
// window.hideInstallButton = hideInstallButton;
