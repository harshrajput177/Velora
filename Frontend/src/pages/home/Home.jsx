import React, { useState, useEffect, useMemo, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import ProfileCard from "../../components/profile/ProfileCard";
import DateRequestModal from "../../components/dating/DateRequestModal";
import CompanionBookingModal from "../../components/companion/CompanionBookingModal";
import SnapMomentsSection from "../../components/moments/SnapMomentsSection";
import { INITIAL_COMPANIONS } from "../../constants/initialCompanions";
import { addMatch } from "../../utils/mockStorage";
import { useAuth } from "../../context/AuthContext";
import confetti from "canvas-confetti";
import "./home.css";
import {
  FiShield,
  FiMapPin,
  FiLock,
  FiZap,
  FiArrowRight,
  FiSearch,
  FiStar,
  FiCheck,
  FiCheckCircle,
  FiHeart,
  FiUsers,
  FiUser,
  FiCalendar,
  FiClock,
  FiAward,
  FiSmile,
  FiActivity,
  FiRefreshCw,
  FiSliders,
  FiPhoneCall
} from "react-icons/fi";
import {
  FaWineGlassAlt,
  FaGlassCheers,
  FaCoffee,
  FaFilm,
  FaShoppingBag,
  FaCompass,
  FaUserTie,
  FaQuoteLeft,
  FaGem
} from "react-icons/fa";

/* ---------- OCCASIONS & TRUST DATA ---------- */
const occasions = [
  { id: "dinner", name: "Romantic Fine Dining", Icon: FaWineGlassAlt, desc: "CyberHub, Olive Bar, Khan Market", duration: "2–3 hrs", tone: "#F8E3EA", accent: "#B4234B" },
  { id: "event", name: "Wedding & Plus-One", Icon: FaGlassCheers, desc: "Cultured, articulate, well-dressed company", duration: "3–5 hrs", tone: "#E9E3F5", accent: "#5B3FA3" },
  { id: "coffee", name: "Coffee & Conversation", Icon: FaCoffee, desc: "Blue Tokai, Hauz Khas, Saket", duration: "1–2 hrs", tone: "#F6E9D8", accent: "#A8601A" },
  { id: "movie", name: "Movie Night & Popcorn", Icon: FaFilm, desc: "PVR Director's Cut, Select Citywalk", duration: "3 hrs", tone: "#E1EAF5", accent: "#2C5F9E" },
  { id: "shopping", name: "Shopping with a Stylist", Icon: FaShoppingBag, desc: "DLF Emporio, Sector 18 Noida", duration: "2–4 hrs", tone: "#F5E1EE", accent: "#A12A74" },
  { id: "travel", name: "Day Trips & City Tours", Icon: FaCompass, desc: "Old Delhi food walks, Neemrana", duration: "Full day", tone: "#DDF0E9", accent: "#1F7A5C" }
];

const steps = [
  {
    num: "01",
    title: "Choose your companion",
    text: "Browse verified profiles with real photos, interests, languages, and transparent hourly rates.",
    Icon: FiUser
  },
  {
    num: "02",
    title: "Pick a date & public venue",
    text: "Cafe, fine dining restaurant, mall, or social event. Every meeting is 100% public and consensual.",
    Icon: FiMapPin
  },
  {
    num: "03",
    title: "SafeTrack™ & In-Hand Pay",
    text: "Zero booking fees on the app. Pay the rental rate directly to companion in hand at the public meetup.",
    Icon: FiShield
  },
  {
    num: "04",
    title: "Enjoy the experience",
    text: "Pleasant conversation, zero awkwardness, polite company, and a memorable time without strings attached.",
    Icon: FiSmile
  }
];

const reviews = [
  {
    name: "Kabir R.",
    area: "Gurgaon, DLF Cyber City",
    text: "Needed a plus-one for a high-profile corporate networking dinner at CyberHub. Ananya was articulate, warm and impeccably dressed. Everything was on time, transparent, and completely professional.",
    companion: "Rented Ananya",
    rating: 5,
    tag: "Corporate Dinner"
  },
  {
    name: "Priya M.",
    area: "South Delhi, Hauz Khas",
    text: "Rohan joined me for an indie film screening and coffee after. Polite, attentive, great listener, and I felt completely safe the entire time. SafeTrack GPS gave me total peace of mind.",
    companion: "Rented Rohan",
    rating: 5,
    tag: "Movie & Cafe"
  },
  {
    name: "Vikram S.",
    area: "Noida, Sector 18",
    text: "Tanya helped me pick out a festive wardrobe at DLF Mall of India. Great eye for fashion and worth every rupee. Outstanding experience!",
    companion: "Rented Tanya",
    rating: 5,
    tag: "Personal Styling"
  }
];

const pledges = [
  {
    title: "Zero Solicitation or Inappropriate Conduct",
    text: "Meetings are strictly for social companionship. Violations lead to instant blacklisting."
  },
  {
    title: "Escrow Wallet Guarantee",
    text: "Payment is safely held until your meeting concludes satisfactorily without disputes."
  },
  {
    title: "SafeTrack™ Automated Check-ins",
    text: "Every 30 minutes, both parties confirm safety via an automated discreet check-in prompt."
  }
];

const areas = ["ALL", "Gurgaon", "Delhi", "Noida", "Saket", "Hauz Khas", "Aerocity"];

const photoOf = (c) =>
  c?.photos?.[0] || c?.photo || c?.image || c?.avatar || c?.profilePhoto || c?.imageUrl || "";

/* ---------- SMALL HELPERS ---------- */
const Stars = ({ count = 5 }) => (
  <span className="rg-stars" aria-label={`${count} out of 5 stars`}>
    {Array.from({ length: count }).map((_, i) => (
      <FiStar key={i} size={15} fill="currentColor" />
    ))}
  </span>
);

/* Smooth scroll-reveal (respects reduced motion) */
const Reveal = ({ children, delay = 0, className = "", as: Tag = "div", ...rest }) => {
  const ref = useRef(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia?.("(prefers-reduced-motion: reduce)").matches
    ) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      className={`rg-reveal ${seen ? "in" : ""} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
      {...rest}
    >
      {children}
    </Tag>
  );
};

const Home = () => {
  const { isAuthenticated, loginDemoUser } = useAuth();
  const navigate = useNavigate();

  const [companions, setCompanions] = useState(INITIAL_COMPANIONS);
  const [selectedGender, setSelectedGender] = useState("ALL");
  const [selectedArea, setSelectedArea] = useState("ALL");
  const [selectedOccasion, setSelectedOccasion] = useState("");
  const [quickFilter, setQuickFilter] = useState("ALL"); // ALL | AVAILABLE | RATED

  // Modals
  const [datePartner, setDatePartner] = useState(null);
  const [bookCompanion, setBookCompanion] = useState(null);

  useEffect(() => {
    setCompanions(INITIAL_COMPANIONS);
  }, []);

  const handleLike = (targetUserId) => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    const companion = INITIAL_COMPANIONS.find((c) => (c.userId || c.id) === targetUserId);
    if (companion) {
      addMatch(companion);
      try {
        confetti({ particleCount: 90, spread: 60, origin: { y: 0.6 } });
      } catch (err) {
        console.log(err);
      }
      alert(`Mutual Match with ${companion.firstName}! You can chat now in Messages.`);
    } else {
      alert("Profile Liked!");
    }
  };

  const filteredCompanions = useMemo(() => {
    return companions.filter((c) => {
      if (selectedGender !== "ALL" && c.gender !== selectedGender) return false;
      if (
        selectedArea !== "ALL" &&
        !c.area?.toLowerCase().includes(selectedArea.toLowerCase()) &&
        !c.city?.toLowerCase().includes(selectedArea.toLowerCase())
      ) {
        return false;
      }
      if (quickFilter === "AVAILABLE" && !c.availableNow) return false;
      if (quickFilter === "RATED" && (c.rating || 0) < 4.95) return false;
      return true;
    });
  }, [companions, selectedGender, selectedArea, quickFilter]);

  const heroPics = INITIAL_COMPANIONS.slice(0, 3);

  const handleSearch = () => {
    if (selectedOccasion) {
      navigate(`/discover?activity=${selectedOccasion}`);
      return;
    }
    document.getElementById("rg-companions")?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const HeadingIcon =
    selectedGender === "FEMALE" ? FiHeart : selectedGender === "MALE" ? FaUserTie : FaGem;
  const heading =
    selectedGender === "FEMALE"
      ? "Girlfriend Companions"
      : selectedGender === "MALE"
      ? "Boyfriend Companions"
      : "All Verified Companions";

  const genderTabs = [
    ["ALL", "All", FiUsers],
    ["FEMALE", "Girlfriend (GF)", FiHeart],
    ["MALE", "Boyfriend (BF)", FaUserTie]
  ];

  return (
    <div className="rg-app">

      {/* 1. Live Social Activity Ticker */}
      <div className="rg-ticker">
        <span className="rg-ticker-item">
          <span className="rg-pulse-dot" />
          32 Companions Active Now in Delhi NCR
        </span>
        <span className="rg-ticker-item d-none d-md-inline-flex">
          <FiShield size={14} /> 100% 18+ ID Verified & Direct Connect
        </span>
        <span className="rg-ticker-item d-none d-lg-inline-flex">
          <FiZap size={14} /> Avg Arrival: 25 Mins
        </span>
      </div>

      {/* 2. Hero Section with Search & Collage */}
      <section className="rg-hero">
        <div className="rg-wrap rg-hero-grid">
          <div>
            <span className="rg-pill">
              <FiAward size={14} /> Delhi NCR's Premier Companion Rental Platform
            </span>
            <h1>
              Rent a Verified <span className="highlight">Girlfriend or Boyfriend</span> in Delhi NCR
            </h1>
            <p className="rg-lead">
              Cultured, articulate, and vetted companions for romantic dinners, wedding plus-ones, shopping stylist walks, or casual cafe talks. Transparent hourly rates with live SafeTrack™ GPS protection.
            </p>

            {/* Quick Search & Booking Bar */}
            <div className="rg-bar" role="search">
              <div className="rg-field">
                <label htmlFor="rg-who">
                  <FiUsers size={13} /> Companion
                </label>
                <select
                  id="rg-who"
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.target.value)}
                >
                  <option value="ALL">Any companion</option>
                  <option value="FEMALE">Girlfriend (GF)</option>
                  <option value="MALE">Boyfriend (BF)</option>
                </select>
              </div>

              <div className="rg-field">
                <label htmlFor="rg-where">
                  <FiMapPin size={13} /> Location
                </label>
                <select
                  id="rg-where"
                  value={selectedArea}
                  onChange={(e) => setSelectedArea(e.target.value)}
                >
                  {areas.map((a) => (
                    <option key={a} value={a}>
                      {a === "ALL" ? "All Delhi NCR" : a}
                    </option>
                  ))}
                </select>
              </div>

              <div className="rg-field">
                <label htmlFor="rg-occ">
                  <FiCalendar size={13} /> Occasion
                </label>
                <select
                  id="rg-occ"
                  value={selectedOccasion}
                  onChange={(e) => setSelectedOccasion(e.target.value)}
                >
                  <option value="">Any occasion</option>
                  {occasions.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.name}
                    </option>
                  ))}
                </select>
              </div>

              <button type="button" className="rg-go" onClick={handleSearch}>
                <FiSearch size={16} /> <span>Find Companions</span>
              </button>
            </div>

            {!isAuthenticated && (
              <div className="rg-demo">
                Just exploring?{" "}
                <button type="button" onClick={() => loginDemoUser()}>
                  Try the demo as Kabir
                </button>
              </div>
            )}
          </div>

          {/* Photo Collage */}
          <div className="rg-collage" aria-hidden="true">
            {heroPics.map((c, i) => (
              <div
                className="rg-arch"
                key={c.userId || c.id || i}
                onClick={() => navigate(`/companion/${c.userId || c.id}`)}
                title={`View ${c.firstName}'s profile`}
              >
                {photoOf(c) ? (
                  <img src={photoOf(c)} alt={c.firstName} loading="lazy" />
                ) : (
                  <div className="rg-arch-ph">{(c.firstName || "K").charAt(0)}</div>
                )}
                <span className="rg-arch-tag">
                  {c.firstName}, {c.age} • ₹{c.hourlyRate}/hr
                </span>
              </div>
            ))}
            <div className="rg-float rg-f1">
              <span className="ic"><FiMapPin size={18} /></span>
              <div>
                <b>SafeTrack™ Live GPS</b>
                <span>WhatsApp link to trusted contact</span>
              </div>
            </div>
            <div className="rg-float rg-f2">
              <span className="ic"><FiStar size={18} fill="currentColor" /></span>
              <div>
                <b>4.98 / 5.0 Rating</b>
                <span>From 1,240+ verified bookings</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Trust & Safety Strip */}
      <div className="rg-wrap rg-trust">
        <div className="rg-trust-in">
          <div className="rg-t">
            <span className="ic"><FiShield size={22} /></span>
            <div>
              <b>18+ ID Verified</b>
              <span className="tx">Government Aadhaar + live video selfie check</span>
            </div>
          </div>
          <div className="rg-t">
            <span className="ic"><FiMapPin size={22} /></span>
            <div>
              <b>SafeTrack™ Live GPS</b>
              <span className="tx">Automated 30-min check-in & SOS contact link</span>
            </div>
          </div>
          <div className="rg-t">
            <span className="ic"><FiLock size={22} /></span>
            <div>
              <b>100% Public Venues</b>
              <span className="tx">Strictly consensual companionship, zero solicitation</span>
            </div>
          </div>
          <div className="rg-t">
            <span className="ic"><FiZap size={22} /></span>
            <div>
              <b>20–30 Min Arrival</b>
              <span className="tx">Instant companion arrival with direct in-hand payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* 4. Daily Photo Drops / Snap Moments */}
      <div className="rg-wrap mt-4">
        <SnapMomentsSection
          onOpenBookingModal={(companion) => {
            if (!isAuthenticated) return navigate("/login");
            setBookCompanion(companion);
          }}
        />
      </div>

      {/* 5. Companions Feed */}
      <section className="rg-sec" id="rg-companions">
        <div className="rg-wrap">
          <Reveal className="rg-head">
            <div>
              <span className="rg-head-badge"><FiCheckCircle size={13} /> Verified Companions</span>
              <h2>
                <span className="h-ic"><HeadingIcon size={26} /></span>
                {heading}
              </h2>
              <p>Available now in Delhi, Gurgaon and Noida. Tap a profile to view verified photos, reviews & book directly.</p>
            </div>

            {/* Gender Switcher */}
            <div className="rg-tabs" role="tablist" aria-label="Companion type">
              {genderTabs.map(([val, label, TabIcon]) => (
                <button
                  key={val}
                  type="button"
                  role="tab"
                  aria-selected={selectedGender === val}
                  className={`rg-tab ${selectedGender === val ? "on" : ""}`}
                  onClick={() => setSelectedGender(val)}
                >
                  <TabIcon size={14} /> {label}
                </button>
              ))}
            </div>
          </Reveal>

          {/* Location & Quick Filter Chips */}
          <div className="d-flex flex-wrap align-items-center justify-content-between gap-3 mb-4">
            <div className="rg-chips">
              {areas.map((a) => (
                <button
                  key={a}
                  type="button"
                  className={`rg-chip ${selectedArea === a ? "on" : ""}`}
                  onClick={() => setSelectedArea(a)}
                >
                  <FiMapPin size={13} /> {a === "ALL" ? "All Delhi NCR" : a}
                </button>
              ))}
            </div>

            {/* Quick Status Filters */}
            <div className="d-flex gap-2">
              <button
                type="button"
                className={`rg-chip ${quickFilter === "AVAILABLE" ? "on" : ""}`}
                onClick={() => setQuickFilter((f) => (f === "AVAILABLE" ? "ALL" : "AVAILABLE"))}
              >
                <FiActivity size={13} /> Available Now
              </button>
              <button
                type="button"
                className={`rg-chip ${quickFilter === "RATED" ? "on" : ""}`}
                onClick={() => setQuickFilter((f) => (f === "RATED" ? "ALL" : "RATED"))}
              >
                <FiStar size={13} /> Top 4.95+
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="row g-3 g-md-4">
            {filteredCompanions.map((companion) => (
              <div key={companion.userId || companion.id} className="col-12 col-sm-6 col-lg-3">
                <ProfileCard
                  profile={companion}
                  onLike={handleLike}
                  onOpenDateModal={(p) => {
                    if (!isAuthenticated) return navigate("/login");
                    setDatePartner(p);
                  }}
                  onOpenBookModal={(p) => {
                    if (!isAuthenticated) return navigate("/login");
                    setBookCompanion(p);
                  }}
                />
              </div>
            ))}

            {filteredCompanions.length === 0 && (
              <div className="col-12">
                <div className="rg-empty">
                  <div className="ic"><FiSliders size={24} /></div>
                  <h5>No companions match these filters</h5>
                  <p>Try picking a different NCR area or reset filters.</p>
                  <button
                    type="button"
                    className="rg-link"
                    onClick={() => {
                      setSelectedGender("ALL");
                      setSelectedArea("ALL");
                      setQuickFilter("ALL");
                    }}
                  >
                    <FiRefreshCw size={15} /> Reset filters
                  </button>
                </div>
              </div>
            )}
          </div>

          <div className="text-center mt-5">
            <Link to="/discover" className="rg-link">
              See all {companions.length} companions <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>

      {/* 6. Occasions Bento Section */}
      <section className="rg-sec">
        <div className="rg-wrap">
          <Reveal className="rg-head">
            <div>
              <span className="rg-head-badge"><FiCalendar size={13} /> Tailored Experiences</span>
              <h2>Book for any occasion</h2>
              <p>Pick a plan and explore companions who suit it. You can customise the venue and timings anytime.</p>
            </div>
          </Reveal>
          <div className="rg-bento">
            {occasions.map((o, i) => (
              <Reveal
                as="button"
                delay={i * 70}
                key={o.id}
                type="button"
                className="rg-occ"
                style={{ background: o.tone, transitionDelay: `${i * 70}ms` }}
                onClick={() => navigate(`/discover?activity=${o.id}`)}
              >
                <span className="em" aria-hidden="true" style={{ color: o.accent }}>
                  <o.Icon size={24} />
                </span>
                <h4>{o.name}</h4>
                <small>{o.desc}</small>
                <span className="tm"><FiClock size={12} /> {o.duration}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* 7. How Booking Works */}
      <section className="rg-sec">
        <div className="rg-wrap">
          <Reveal className="rg-head">
            <div>
              <span className="rg-head-badge"><FiLock size={13} /> Simple & Safe</span>
              <h2>How rental booking works</h2>
              <p>Four transparent steps, 100% consensual, with zero booking fees on the app.</p>
            </div>
          </Reveal>
          <div className="rg-steps">
            {steps.map((s, i) => (
              <Reveal className="rg-step-card" key={s.num} delay={i * 90}>
                <div className="rg-step-top">
                  <span className="rg-step-ic"><s.Icon size={22} /></span>
                  <span className="rg-step-num">{s.num}</span>
                </div>
                <h4>{s.title}</h4>
                <p>{s.text}</p>
              </Reveal>
            ))}
          </div>

          {/* Safety Manifesto Box */}
          <Reveal className="rg-pledge">
            <FiShield className="rg-pledge-bg" size={220} aria-hidden="true" />
            <div className="rg-pledge-grid">
              <div>
                <span className="rg-code"><FiShield size={13} /> THE VELORA CODE</span>
                <h3>Our Non-Negotiable Safety Promise</h3>
                <p className="rg-pledge-lead">
                  Velora is built on mutual respect, discretion, and strict safety. Every rental is platonic, public, and backed by our 24/7 client support line.
                </p>
              </div>
              <div>
                {pledges.map((p) => (
                  <div className="rg-pledge-item" key={p.title}>
                    <span className="ck"><FiCheck size={16} /></span>
                    <div>
                      <strong>{p.title}</strong>
                      <p>{p.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* 8. Verified Reviews */}
      <section className="rg-sec">
        <div className="rg-wrap">
          <Reveal className="rg-head">
            <div>
              <span className="rg-head-badge"><FiSmile size={13} /> Real Experiences</span>
              <h2>What verified clients say</h2>
              <p>Genuine feedback from completed bookings in Gurgaon, South Delhi and Noida.</p>
            </div>
          </Reveal>
          <div className="rg-rev">
            {reviews.map((r, idx) =>
              idx === 0 ? (
                <Reveal className="rg-rev-big" key={r.name}>
                  <div>
                    <FaQuoteLeft className="rg-quote" size={34} />
                    <Stars count={r.rating} />
                    <p>{r.text}</p>
                  </div>
                  <div className="rg-who">
                    <span className="rg-avatar">{r.name.charAt(0)}</span>
                    <div>
                      <b>{r.name}</b>
                      <span className="meta">{r.area} · {r.companion}</span>
                      <span className="rg-tag"><FiCheckCircle size={11} /> {r.tag}</span>
                    </div>
                  </div>
                </Reveal>
              ) : (
                <Reveal className="rg-rev-sm" key={r.name} delay={idx * 90}>
                  <Stars count={r.rating} />
                  <p>{r.text}</p>
                  <div className="rg-who">
                    <span className="rg-avatar">{r.name.charAt(0)}</span>
                    <div>
                      <b>{r.name}</b>
                      <span className="meta">{r.area} · {r.companion}</span>
                      <span className="rg-tag"><FiCheckCircle size={11} /> {r.tag}</span>
                    </div>
                  </div>
                </Reveal>
              )
            )}
          </div>

          {/* Final CTA */}
          <Reveal className="rg-cta">
            <div>
              <h3>Your first meeting, planned in minutes</h3>
              <ul className="rg-cta-list">
                <li><FiCheckCircle size={16} /> 100% ID Verified Profiles</li>
                <li><FiCheckCircle size={16} /> Public Venues</li>
                <li><FiCheckCircle size={16} /> SafeTrack™ GPS Protection</li>
                <li><FiPhoneCall size={16} /> 24/7 Support</li>
              </ul>
            </div>
            <a className="rg-go" href="#rg-companions">
              Browse companions <FiArrowRight />
            </a>
          </Reveal>
        </div>
      </section>

      {/* Booking & Date Modals */}
      <DateRequestModal
        show={!!datePartner}
        onHide={() => setDatePartner(null)}
        partner={datePartner}
      />
      <CompanionBookingModal
        show={!!bookCompanion}
        onHide={() => setBookCompanion(null)}
        companion={bookCompanion}
      />
    </div>
  );
};

export default Home;