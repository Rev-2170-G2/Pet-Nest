import "./About.css";

export default function About() {
  return (
    <div className="about-container">
      <h1>About PetNest</h1>
      <p>
        PetNest is a community-driven platform that connects pet owners with event organizers.
        Whether you want to showcase your pet's talents or find amazing pets for your events,
        PetNest makes it simple, fun, and trustworthy.
      </p>

      <h2>Our Team</h2>
      <p>Built by passionate developers who love pets and technology!</p>

      <div className="github-links">
        <a href="https://github.com/H-Pfeiffer" target="_blank" rel="noopener noreferrer">Heather Pfeiffer</a>
        <a href="https://github.com/abusooddean" target="_blank" rel="noopener noreferrer">Dean Abusood</a>
        <a href="https://github.com/ChristopherThorne714" target="_blank" rel="noopener noreferrer">Christopher Thorne</a>
        <a href="https://github.com/joshuagapusan" target="_blank" rel="noopener noreferrer">Joshua Gapusan</a>
      </div>
    </div>
  );
}