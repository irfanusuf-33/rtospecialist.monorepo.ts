import '../../../client/scss/rtoconsultationservices/rtoconsultationservices.scss';
import Link from "next/link";
import carouselImg1 from '../../../assets/rtoregistration2.webp';

interface  RtoConsultationSecondHeaderProps {
  heading?: string;
  body?: string;
  secondary?: string;
}



export default function RtoConsultationSecondHeader ({heading, body} : RtoConsultationSecondHeaderProps) {
  return (
    <section className="consultation-second-header-container">
    <picture className="consultation-picture">
      <source srcSet={carouselImg1.src} />
      <source srcSet={carouselImg1.src} />
      <img
        fetchPriority="high" 
        loading="eager" 
        className="picture" 
        style={{ 
          // '--focal-point-x': '50%',
          //  '--focal-point-y': '50%',
            width: '100%' }}
        alt="Bestsellers" 
        title="Bestsellers"
      />
    </picture>
  <div className="consultation-gradient-overlay"></div>

      <div className="container consultation-body-container">
        <div className="flex flex-col md:flex-row items-center justify-between">

          <div className="inner-body-wrapper">
            <h1 className="body-heading">
              {heading}
            </h1>
            <p className="body-text">{body}</p>
            <div className="flex button-container">
              <Link href="/book-appointment" className="get-started-btn">Get Started</Link>
              <Link href="/book-appointment" className="learn-more-btn">Learn More</Link>
            </div>
          </div>
        </div>
      </div>


      <div className="absolute bottom-0 left-0 right-0 z-[999]">
        <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M0 120L60 105C120 90 240 60 360 45C480 30 600 30 720 37.5C840 45 960 60 1080 67.5C1200 75 1320 75 1380 75L1440 75V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0Z" fill="white" />
        </svg>
      </div>
    </section>
  );
}