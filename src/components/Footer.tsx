import Link from "next/link";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-black text-white font-rregular py-5 border-t-4 border-secondary">
      <div className="container mx-auto px-5 lg:px-10">
        <div className="flex flex-col lg:flex-row justify-between gap-5">
          {/* Contact Information */}
          <div className="w-full lg:w-1/4">
            <h4 className="text-xl font-lbold mb-4 text-white">Contact Us</h4>
            <p className="text-sm">
              Jain Enterprises <br />
              2949-B/41 Beadon Pura, <br />
              Karol Bagh, New Delhi, India <br />
              <br />
              Phone:{" "}
              <a href="tel:+919891521784" className="hover:text-secondary">
                +91-9891521784
              </a>{" "}
              <br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
              <a href="tel:+919818138951" className="hover:text-secondary">
                +91-9818138951
              </a>
              <br />
              Email:{" "}
              <a
                href="mailto:jaincodecor@gmail.com"
                className="hover:text-secondary"
              >
                jaincodecor@gmail.com
              </a>
            </p>
          </div>

          {/* Quick Links */}
          <div className="w-full lg:w-1/4">
            <h4 className="text-xl font-lbold mb-4 text-white">Quick Links</h4>
            <ul className="text-sm space-y-2">
              <li>
                <Link href="/about" className="hover:text-secondary">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/catalog" className="hover:text-secondary">
                  Catalog
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-secondary">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-secondary">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Social Media Links */}
          <div className="w-full lg:w-1/4">
            <h4 className="text-xl font-lbold mb-4 text-white">Follow Us</h4>
            <div className="flex space-x-4">
              <a
                href="https://www.facebook.com/jaincodecor"
                className="hover:text-secondary"
                aria-label="facebook page"
              >
                <FaFacebookF />
              </a>
              <a
                href="https://www.instagram.com/jaincodecor"
                className="hover:text-secondary"
                aria-label="instagram page"
              >
                <FaInstagram />
              </a>
              <a
                href="https://www.twitter.com/jaincodecor"
                className="hover:text-secondary"
                aria-label="twitter page"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.linkedin.com/company/jaincodecor"
                className="hover:text-secondary"
                aria-label="linkedin page"
              >
                <FaLinkedinIn />
              </a>
            </div>
          </div>

          {/* Google Map Integration */}
          <div className="w-full lg:w-1/4">
            <h4 className="text-xl font-lbold mb-2 text-white">Visit Us</h4>
            <div className="flex min-h-max overflow-hidden shadow-sm rounded-md relative">
              <iframe
                className="w-full lg:h-56 h-96 -z-0"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3501.2900878296614!2d77.18707987483667!3d28.651031583241572!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390d029c6c99bbd5%3A0xc2af68f4609465a8!2sJain%20Enterprises%2C%20Karol%20Bagh%2C%20Delhi%2C%20India!5e0!3m2!1sen!2sin!4v1727523589591!5m2!1sen!2sin"
                allowFullScreen
                loading="lazy"
                title="Jain Enterprises Address"
              ></iframe>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="mt-5 border-t border-white pt-5">
        <div className="container mx-auto px-5 lg:px-10 text-center py-2">
          <p className="text-sm">
            &copy; {new Date().getFullYear()} Jainco Decor. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
