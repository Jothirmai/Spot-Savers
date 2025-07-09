import React, { useEffect, useState } from 'react';
import '../css/home.scss';

function Home() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000); // 1 second loading spinner

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading ? (
        <div className="page-spinner-container">
          <svg
            className="animate-spinner"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            width="50"
            height="50"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
            />
          </svg>
        </div>
      ) : (
        <div>
          <div className="banner">
            <div className="overlay">
              <h1>
                Looking for parking. <br /> <span>You have came to right place</span>
              </h1>
            </div>
          </div>

          <div className="container mt-5">
            <section className="my-5">
              <h2>How Spot-Savers Works</h2>
              <div className="row mt-4">
                <div className="col-md-4 text-center">
                  <div className="card p-4">
                    <img src="./map.avif" className="services-card-icon" alt="Search" />
                    <div className="mt-4">
                      <h3>Search</h3>
                      <p className="mt-3">Search for a parking spot according to your needs.</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 text-center">
                  <div className="card p-4">
                    <img src="./book.png" className="services-card-icon" alt="Book" />
                    <div className="mt-4">
                      <h3>Book</h3>
                      <p className="mt-3">Reserved Parking spot and pay desired amount.</p>
                    </div>
                  </div>
                </div>

                <div className="col-md-4 text-center">
                  <div className="card p-4">
                    <img src="./parking.png" className="services-card-icon" alt="Park" />
                    <div className="mt-4">
                      <h3>Park</h3>
                      <p className="mt-3">Follow the provided instructions and park your car.</p>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="my-5">
              <h2 className="mt-5">Testimonial</h2>
              <div className="row">
                <div className="col-md-6">
                  <div className="testimonial-card p-3 rounded text-center">
                    <img src="./profile-1.jpeg" alt="Harry" />
                    <p className="mt-4 mb-3">
                      "I recently used Spot-Savers, a parking booking website, and I was thoroughly
                      impressed with the service. The Rent-A-Spot website was user-friendly and easy
                      to navigate..."
                    </p>
                    <span>
                      <strong>Harry</strong> Manager at Google
                    </span>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="testimonial-card p-3 rounded text-center">
                    <img src="./profile-1.webp" alt="Mill" />
                    <p className="mt-4 mb-3">
                      "I cannot express how grateful I am for Spot-Savers. Spot-Savers has made the
                      process incredibly convenient and stress-free..."
                    </p>
                    <span>
                      <strong>Mill</strong> Co-founder at Tim Hortons
                    </span>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      )}
    </>
  );
}

export default Home;
