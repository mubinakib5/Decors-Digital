'use client';

export default function TestScroll() {
  return (
    <div style={{ height: '200vh', padding: '20px' }}>
      <h1>Scroll Test Page</h1>
      <p>Scroll down to see the back-to-top button appear</p>
      
      {/* Add some content to make scrolling possible */}
      {Array.from({ length: 50 }, (_, i) => (
        <div key={i} style={{ margin: '20px 0', padding: '10px', border: '1px solid #ccc' }}>
          Section {i + 1} - Scroll down to test the button
        </div>
      ))}
      
      {/* Scroll to Top Button */}
      <div className="get-template hstack gap-2 position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
        <button
          className="btn bg-primary p-2 round-52 rounded-circle hstack justify-content-center flex-shrink-0 hidden"
          id="scrollToTopBtn"
        >
          <iconify-icon
            icon="lucide:arrow-up"
            className="fs-7 text-dark"
          ></iconify-icon>
        </button>
      </div>
    </div>
  );
}
