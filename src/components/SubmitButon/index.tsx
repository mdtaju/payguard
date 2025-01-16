"use client";
import { useState } from "react";

const SubmitButton = ({ ...rest }) => {
  const [loading, setLoading] = useState(false);

  return (
    <button
      onClick={() => setLoading(true)}
      disabled={loading}
      type="submit"
      {...rest}
      className="btn w-full mt-6">
      {loading ? <span>loading...</span> : <span>Submit</span>}
    </button>
  );
};

export default SubmitButton;
