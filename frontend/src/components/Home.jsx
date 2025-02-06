import React from "react";
import logo from "../images/ghssLogo.png"; // Ensure the path to your logo is correct

function Home() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col items-center justify-center">
      {/* Logo at the Top */}
      <div className="mb-6">
        <img
          src={logo}
          alt="School Logo"
          className="h-32 w-32 object-contain mx-auto" // Larger logo size
        />
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto p-8 bg-white shadow-lg rounded-lg">
        {/* School Name */}
        <h1 className="text-4xl font-bold text-gray-900 mb-6 text-center">
          Welcome to GHSS Luqman Banda
        </h1>

        {/* Intro Paragraph */}
        <p className="text-lg text-gray-700 mb-4 text-center">
          Government Higher Secondary School (GHSS) Luqman Banda is committed to
          providing a quality education that fosters academic excellence,
          character development, and community involvement. Our school strives
          to create a nurturing and stimulating environment where students are
          encouraged to grow, explore, and achieve their full potential.
        </p>

        {/* Vision Statement */}
        <p className="text-lg text-gray-700 mb-6 text-center">
          At GHSS Luqman Banda, we believe in empowering students with the
          knowledge and skills they need to succeed in an ever-changing world.
          We encourage creativity, critical thinking, and collaboration to
          prepare our students for the challenges of tomorrow.
        </p>
      </div>
    </div>
  );
}

export default Home;
