import React from "react";

function Documents() {
  return (
    <section>
      <img
        src = {process.env.PUBLIC_URL + '/images/under-construct.webp'}
        alt="under construction"
        className="w-100"
        style={{ height: "500px" }}
      />
    </section>
  );
}

export default Documents;
