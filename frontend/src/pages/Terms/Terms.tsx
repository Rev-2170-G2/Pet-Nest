import "./Terms.css";

export default function Terms() {
  return (
    <div className="terms-container">
      <h1>Terms & Conditions</h1>
      <p>
        Welcome to PetNest! By accessing or using our platform, you agree to the following
        terms and conditions. Please read them carefully before continuing.
      </p>

      <h2>1. User Responsibilities</h2>
      <p>
        You are responsible for ensuring that all information you submit, including pet details
        and event postings, is accurate and does not violate any applicable laws.
      </p>

      <h2>2. Content Ownership</h2>
      <p>
        All content uploaded to PetNest remains the property of its respective owners. By posting,
        you grant us permission to display and share your content on our platform.
      </p>

      <h2>3. Disclaimer</h2>
      <p>
        PetNest is a platform to connect users. We are not responsible for any issues or disputes
        arising from interactions between users.
      </p>

      <h2>4. Modifications</h2>
      <p>
        We reserve the right to update or modify these terms at any time. Continued use of PetNest
        means you accept any changes made.
      </p>

      <p className="terms-end">
        Thank you for using PetNest — we hope you and your pets enjoy the experience!
      </p>
    </div>
  );
}