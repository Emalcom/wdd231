// statistics.js - Handles statistical data for the dashboard

/**
 * Sample statistics data for demonstration
 */
const sampleStats = {
    newPatients: 24,
    returningPatients: 78,
    totalPatients: 102
  };
  
  /**
   * Loads statistics data and updates the dashboard
   */
  export async function loadStatistics() {
    console.log('Loading statistics...');
    
    // In a real app, this would fetch from an API
    // Simulate API call with timeout
    return new Promise((resolve) => {
      setTimeout(() => {
        // New patients counter
        const newPatientsElement = document.getElementById('new-patients');
        if (newPatientsElement) {
          animateCounter(newPatientsElement, sampleStats.newPatients);
        }
        
        // Returning patients counter
        const returningPatientsElement = document.getElementById('returning-patients');
        if (returningPatientsElement) {
          animateCounter(returningPatientsElement, sampleStats.returningPatients);
        }
        
        // Total patients counter
        const totalPatientsElement = document.getElementById('total-patients');
        if (totalPatientsElement) {
          animateCounter(totalPatientsElement, sampleStats.totalPatients);
        }
        
        resolve();
      }, 500); // Simulate network delay
    });
  }
  
  /**
   * Animates counting up to a target number
   */
  function animateCounter(element, targetNumber) {
    const duration = 1500; // milliseconds
    const frameDuration = 1000 / 60; // 60fps
    const totalFrames = Math.round(duration / frameDuration);
    let frame = 0;
    
    const countUp = () => {
      frame++;
      const progress = frame / totalFrames;
      const currentCount = Math.floor(progress * targetNumber);
      element.textContent = currentCount;
      
      if (frame < totalFrames) {
        requestAnimationFrame(countUp);
      } else {
        element.textContent = targetNumber;
      }
    };
    
    countUp();
  }