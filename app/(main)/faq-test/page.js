"use client";

import FaqSection from '../../components/FaqSection';

export default function FaqTestPage() {
  return (
    <div className="container py-5">
      <h1 className="mb-4">FAQ Test - Minimal Bootstrap Accordion</h1>
      
      <div className="accordion" id="accordionExample">
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#collapseOne" 
              aria-expanded="false" 
              aria-controls="collapseOne"
            >
              Test Question 1
            </button>
          </h2>
          <div 
            id="collapseOne" 
            className="accordion-collapse collapse" 
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              This is the first test answer. It should stay open when clicked and close when another item is clicked.
            </div>
          </div>
        </div>
        
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#collapseTwo" 
              aria-expanded="false" 
              aria-controls="collapseTwo"
            >
              Test Question 2
            </button>
          </h2>
          <div 
            id="collapseTwo" 
            className="accordion-collapse collapse" 
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              This is the second test answer. Testing if the accordion behavior works correctly.
            </div>
          </div>
        </div>
        
        <div className="accordion-item">
          <h2 className="accordion-header">
            <button 
              className="accordion-button collapsed" 
              type="button" 
              data-bs-toggle="collapse" 
              data-bs-target="#collapseThree" 
              aria-expanded="false" 
              aria-controls="collapseThree"
            >
              Test Question 3
            </button>
          </h2>
          <div 
            id="collapseThree" 
            className="accordion-collapse collapse" 
            data-bs-parent="#accordionExample"
          >
            <div className="accordion-body">
              This is the third test answer. If this works, the issue is with the contact page implementation.
            </div>
          </div>
        </div>
      </div>
      
      <div className="mt-5">
        <h3>Debug Information</h3>
        <p>If the accordion above works correctly, the issue is specific to the contact page.</p>
        <p>If it doesn't work, there's a global Bootstrap or JavaScript issue.</p>
        
        <div className="mt-3">
          <button 
            className="btn btn-primary me-2" 
            onClick={() => console.log('Bootstrap version:', typeof bootstrap !== 'undefined' ? 'Loaded' : 'Not loaded')}
          >
            Check Bootstrap
          </button>
          <button 
            className="btn btn-secondary" 
            onClick={() => console.log('jQuery version:', typeof $ !== 'undefined' ? $.fn.jquery : 'Not loaded')}
          >
            Check jQuery
          </button>
        </div>
      </div>
    </div>
  );
}
