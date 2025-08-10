import Header from '../components/Header';
import Image from 'next/image';
import Link from 'next/link';
import Footer from '../components/Footer';

export default function SignIn() {
  return (
    <>
      <Header />
      
      {/* Page Wrapper */}
      <div className="page-wrapper overflow-hidden">
        {/* Sign In Section */}
        <section className="sign-in py-5 py-lg-11 py-xl-12 d-flex align-items-center min-vh-100">
          <div className="container">
            <div className="row justify-content-center">
              <div className="col-md-8 col-lg-6 col-xl-5">
                <div
                  className="sign-in-wrapper bg-white rounded-4 p-4 p-lg-5 shadow-sm"
                  data-aos="fade-up"
                  data-aos-delay="100"
                  data-aos-duration="1000"
                >
                  <div className="text-center mb-5">
                    <Link href="/" className="d-inline-block mb-4">
                      <Image
                        src="/assets/images/logos/logo-dark.png"
                        alt="Logo"
                        width={150}
                        height={50}
                        className="img-fluid"
                      />
                    </Link>
                    <h2 className="mb-2">Welcome Back</h2>
                    <p className="text-muted mb-0">
                      Sign in to your account to continue
                    </p>
                  </div>
                  
                  <form className="d-flex flex-column gap-4">
                    <div className="form-floating">
                      <input
                        type="email"
                        className="form-control"
                        id="email"
                        placeholder="Email"
                      />
                      <label htmlFor="email">Email</label>
                    </div>
                    <div className="form-floating">
                      <input
                        type="password"
                        className="form-control"
                        id="password"
                        placeholder="Password"
                      />
                      <label htmlFor="password">Password</label>
                    </div>
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-check">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          id="remember"
                        />
                        <label className="form-check-label" htmlFor="remember">
                          Remember me
                        </label>
                      </div>
                      <Link href="/forgot-password" className="text-primary text-decoration-none">
                        Forgot password?
                      </Link>
                    </div>
                    <button type="submit" className="btn btn-primary w-100">
                      Sign In
                    </button>
                  </form>
                  
                  <div className="text-center mt-4">
                    <p className="mb-0">
                      Don't have an account?{' '}
                      <Link href="/sign-up" className="text-primary text-decoration-none">
                        Sign up
                      </Link>
                    </p>
                  </div>
                  
                  <div className="mt-4">
                    <div className="d-flex align-items-center mb-3">
                      <hr className="flex-grow-1" />
                      <span className="px-3 text-muted">Or continue with</span>
                      <hr className="flex-grow-1" />
                    </div>
                    <div className="d-flex gap-3">
                      <button className="btn btn-outline-secondary flex-grow-1">
                        <iconify-icon icon="lucide:github" className="me-2"></iconify-icon>
                        GitHub
                      </button>
                      <button className="btn btn-outline-secondary flex-grow-1">
                        <iconify-icon icon="lucide:mail" className="me-2"></iconify-icon>
                        Google
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <Footer />
      </div>

      {/* Scroll to Top Button */}
      <div className="get-template hstack gap-2 position-fixed bottom-0 end-0 m-4" style={{ zIndex: 1000 }}>
        <button
          className="btn bg-primary p-2 round-52 rounded-circle hstack justify-content-center flex-shrink-0"
          id="scrollToTopBtn"
          style={{ display: 'none' }}
        >
          <iconify-icon
            icon="lucide:arrow-up"
            className="fs-7 text-dark"
          ></iconify-icon>
        </button>
      </div>
    </>
  );
}
