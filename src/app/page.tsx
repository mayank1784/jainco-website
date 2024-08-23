import Image from "next/image";

export default function Home() {
  return (
    <main className="relative flex flex-col min-h-screen w-full p-4">
      {/* <a href="https://wa.me/919891521784?text=Hi%20Jain%20Enterprises" className="" target="_blank">
<i className="fa fa-whatsapp floating"></i>
</a> */}
<a  className="whats-app" href="https://wa.me/919891521784?text=Hi%20Jain%20Enterprises" target="_blank">
    <i className="fa fa-whatsapp my-float"></i>
</a>
      <div className="sm:flex flex-row sm:justify-between h-fit relative">
        <div className="relative flex  ml-5 justify-center">
          <Image
            src="/static/jainco_logo.png"
            alt="ffefef"
            width={150}
            height={100}
            className="contain sm:w-[150px] w-[80px]"
          />
        </div>
        <div className="sm:flex sm:flex-col sm:items-end">
          <div className="min-w-max justify-center">
            <h1 className="sm:text-8xl text-5xl text-center font-extrabold">
              Jainco Decor
            </h1>
            <h3 className="text-3xl font-semibold text-center">
              Decor your Dream Home
            </h3>
          </div>
        </div>
      </div>
      <div className="sm:flex items-stretch sm:flex-row h-max w-full content-ds">
        <div className="sm:flex sm:w-[70%] items-start justify-end sm:text-end info">
          <div>
            <p className="sm:text-xl text-lg mt-7">
              We are the importer, wholesaler and manufacturer of <br />
              PVC Table Covers, AC Curtains, Washing Machine Covers, <br />{" "}
              Fridge Covers, Mattress Protectors and other related items.
            </p>
            <p className="sm:text-2xl text-xl mt-4 underline font-semibold">Website Under Development</p>
            <p className="sm:text-lg text-base mt-3"><span className="font-semibold">Visit Us at: </span><a href="https://g.co/kgs/vQSW72f" target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">Jain Enterprises, 2949-B/41, Beadon Pura, Karol Bagh, New Delhi - 110005</a></p>
            <p className="sm:text-lg text-base mt-3"><span className="font-semibold">Contact us: </span><a href="tel:+919891521784" className="underline">9891521784</a>, <a href="tel:+919818138951" className="underline">9818138951</a>, <a href="tel:+911143621784" className="underline">011 43621784</a></p>
            <p className="sm:text-lg text-base mt-3"><span className="font-semibold">Email us: </span><a href="mailto:jaincodecor@gmail.com" className="underline">jaincodecor@gmail.com</a></p>
          </div>
        </div>

        <div className="sm:w-[30%] sm:flex items-center justify-end flex-grow pr-15 relative ">
          <Image
            src="/static/jainco-phone.png"
            height={417}
            width={295}
            alt="phone"
            className="h-[69vh]"
          />
        </div>
      </div>
    </main>
  );
}
