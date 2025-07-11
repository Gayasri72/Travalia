import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import {
  FaStar,
  FaChartLine,
  FaUsers,
  FaMapMarkerAlt,
  FaCalendarAlt,
  FaClock,
  FaDollarSign,
  FaUserCircle,
} from 'react-icons/fa';
import { useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';
import TourReviews from '../components/tourBooking/TourReviews';

const defaultIcon = L.icon({
  iconUrl,
  shadowUrl: iconShadow,
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = defaultIcon;

const API_URL = import.meta.env.VITE_API_URL;

const fetchTour = async (tourId) => {
  const response = await fetch(`${API_URL}/tours/${tourId}`);
  const data = await response.json();
  if (!data.success) throw new Error('Failed to fetch tour details');
  return data.data.tour;
};

const Tour = () => {
  const { id } = useParams();
  const {
    data: tour,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['tour', id],
    queryFn: () => fetchTour(id),
  });
  const [loadingPayment, setLoadingPayment] = useState(false);
  const [policyAgreed, setPolicyAgreed] = useState(false);
  const [showPolicyModal, setShowPolicyModal] = useState(false);
  const { currentUser } = useSelector((state) => state.user);

  const handleBookNow = async () => {
    setLoadingPayment(true);
    try {
      const res = await fetch(`${API_URL}/bookings/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tourId: id }),
        credentials: 'include',
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Failed to initiate payment.');
      }
    } catch (err) {
      alert('Payment error: ' + err.message);
    } finally {
      setLoadingPayment(false);
    }
  };

  if (isLoading)
    return <p className="text-center text-lg">Loading tour details...</p>;
  if (error)
    return <p className="text-center text-red-500">Error: {error.message}</p>;

  // Debug: Log locations to console
  console.log('tour.locations', tour.locations);

  return (
    <div className="max-w-5xl mx-auto p-6 bg-white shadow-lg rounded-lg ">
      {/* Hero Section */}
      <div className="relative w-full h-96">
        <img
          src={
            tour.imageCover.startsWith('tour-')
              ? `/src/assets/tours/${tour.imageCover}`
              : `/uploads/${tour.imageCover}`
          }
          alt={tour.name}
          className="w-full h-full object-cover rounded-lg"
        />
        <h1 className="absolute bottom-4 left-4 text-white text-3xl font-bold bg-black bg-opacity-50 px-4 py-2 rounded-lg">
          {tour.name}
        </h1>
      </div>

      {/* Tour Details */}
      <div className="mt-6 grid grid-cols-2 gap-6">
        {/* Left: Ratings, Difficulty, Guides */}
        <div>
          <p className="text-lg font-bold flex items-center">
            <FaStar className="text-yellow-500 mr-2" /> {tour.ratingsAverage} (
            {tour.ratingsQuantity} reviews)
          </p>
          <p className="text-lg font-bold flex items-center mt-2">
            <FaChartLine className="text-blue-500 mr-2" /> Difficulty:{' '}
            {tour.difficulty}
          </p>
          <p className="text-lg font-bold flex items-center mt-2">
            <FaUsers className="text-blue-500 mr-2" /> Tour Guides:{' '}
            {tour.guides ? tour.guides.length : 'N/A'}
          </p>
          {tour.guides && tour.guides.length > 0 && (
            <ul className="ml-8 mt-1 list-disc text-base text-gray-700">
              {tour.guides.map((guide, idx) => (
                <li key={idx}>{guide}</li>
              ))}
            </ul>
          )}
          <p>Meet Your Guides</p>
        </div>

        {/* Right: Description */}
        <div>
          <p className="text-gray-700">{tour.description}</p>
        </div>
      </div>

      {/* Tour Gallery */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Tour Gallery</h2>
      <div className="grid grid-cols-3 gap-2">
        {tour.images.slice(0, 3).map((img, index) => (
          <img
            key={index}
            src={
              img.startsWith('tour-')
                ? `/src/assets/tours/${img}`
                : `/uploads/${img}`
            }
            alt={`Tour image ${index + 1}`}
            className="w-full h-40 object-cover rounded-lg shadow-md"
          />
        ))}
      </div>

      {/* Map Section */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Tour Locations</h2>
      <ul className="mb-6 ml-6 list-disc text-gray-800">
        {tour.locations && tour.locations.length > 0 ? (
          tour.locations.map((loc, idx) => (
            <li key={idx} className="mb-1">
              <span className="font-semibold">Day {loc.day}:</span>{' '}
              {loc.description || `Location ${idx + 1}`}
            </li>
          ))
        ) : (
          <li>No locations available for this tour.</li>
        )}
      </ul>
      <div className="w-full h-64 rounded-lg overflow-hidden">
        {tour.locations && tour.locations.length > 0 ? (
          <MapContainer
            center={[
              tour.locations[0].coordinates[1],
              tour.locations[0].coordinates[0],
            ]}
            zoom={7}
            scrollWheelZoom={false}
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {tour.locations.map((loc, idx) => (
              <Marker
                key={idx}
                position={[loc.coordinates[1], loc.coordinates[0]]}
              >
                <Popup>
                  <div>
                    <strong>{loc.description || 'Tour Location'}</strong>
                    <br />
                    {loc.day && <span>Day {loc.day}</span>}
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-200">
            <p className="text-gray-700">
              No locations available for this tour.
            </p>
          </div>
        )}
      </div>

      {/* Review Section */}
      <h2 className="text-2xl font-bold mt-6 mb-4">Customer Reviews</h2>
      {/* Real Reviews Section */}
      <TourReviews tourId={id} currentUser={currentUser} />

      {/* Policy Agreement Checkbox */}
      <div className="mt-6 flex items-center justify-center">
        <input
          type="checkbox"
          id="policy"
          checked={policyAgreed}
          onChange={(e) => setPolicyAgreed(e.target.checked)}
          className="mr-2"
        />
        <label htmlFor="policy" className="text-sm">
          I agree to the{' '}
          <button
            type="button"
            className="text-blue-600 underline bg-transparent border-none cursor-pointer p-0"
            onClick={() => setShowPolicyModal(true)}
          >
            terms and policy
          </button>
          .
        </label>
      </div>
      {/* Policy Modal */}
      {showPolicyModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-8 rounded-lg max-w-lg w-full shadow-lg relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 text-2xl"
              onClick={() => setShowPolicyModal(false)}
              aria-label="Close"
            >
              &times;
            </button>
            <h1 className="text-2xl font-bold mb-4">Terms & Policy</h1>
            <p className="mb-4">
              <strong>Refund Policy:</strong> If you cancel your tour order
              within 7 days of booking, you are eligible for a full refund.
              Cancellations made after 7 days are not eligible for a refund.
            </p>
            <p className="mb-4">
              <strong>Tour Confirmation:</strong> Your tour booking confirmation
              and all related communication will be sent to the email address
              you provided during the booking process. Please ensure your email
              is correct.
            </p>
            <p>
              By proceeding with your booking, you agree to these terms and
              policies.
            </p>
          </div>
        </div>
      )}
      {/* Booking Button */}
      <div className="mt-6 text-center">
        {!currentUser ? (
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700 disabled:opacity-60"
            onClick={() => (window.location.href = '/sign-in')}
          >
            Sign in to Book
          </button>
        ) : (
          <button
            className="bg-blue-600 text-white px-6 py-3 rounded-lg text-lg font-bold shadow-md hover:bg-blue-700 disabled:opacity-60"
            onClick={handleBookNow}
            disabled={loadingPayment || !policyAgreed}
          >
            {loadingPayment ? 'Redirecting...' : 'Book Now'}
          </button>
        )}
      </div>
    </div>
  );
};

<TourReviews />;

export default Tour;
