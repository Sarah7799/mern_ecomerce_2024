import React from "react";
import Layout from "../components/Layout/Layout";
import { BiMailSend, BiPhoneCall, BiSupport } from "react-icons/bi";
const Contact = () => {
  return (
    <Layout tile={"Contact Us"}>
      <div className="row contactus">
        <div className="col-md-6">
          <img
            src="/images/contactus.jpeg"
            alt="contactus"
            style={{ width: "100%" }}
          />
        </div>
        <div className="col-md-4">
          <h1 className="bg-dark text-white p-2 text-center">Contact Us</h1>
          <p className="text-justify mt-2">
            any query and info about prodduct feel free to call anytime we 24X7
            available
          </p>
          <p className="mt-3">
            <BiMailSend /> www.help.ecomerce.com
          </p>
          <p className="mt-3">
            <BiPhoneCall /> 7799632106
          </p>
          <p className="mt-3">
            <BiSupport /> 1800-0000-0000 (toll free)
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
