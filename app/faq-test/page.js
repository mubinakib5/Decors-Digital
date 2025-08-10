import FaqSection from '../components/FaqSection';

export default function FaqTestPage() {
  return (
    <div className="min-vh-100 bg-light">
      <div className="container py-5">
        <div className="row justify-content-center">
          <div className="col-lg-10">
            <div className="text-center mb-5">
              <h1 className="display-4 fw-bold text-dark mb-3">FAQ Functionality Test</h1>
              <p className="lead text-muted">
                Click on the questions below to expand/collapse them. Each question has a custom plus (+) icon when collapsed and minus (-) icon when expanded.
              </p>
            </div>
            <FaqSection />
          </div>
        </div>
      </div>
    </div>
  );
}
