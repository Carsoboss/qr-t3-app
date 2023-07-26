import React, { useState } from "react";
import { trpc } from '../api';

function GetStarted() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [clerkUserId, setClerkUserId] = useState(""); // replace with your own logic to get clerkUserId
  
  const createUserMutation = trpc.useMutation('stickerRouter.createUserTenet');

  const handleSubmit = (e) => {
    e.preventDefault();

    createUserMutation.mutate({
      firstName, lastName, email, phone, clerkUserId
    });
  };

  // Render form
  return (
    <div className="mx-auto max-w-7xl py-12 px-4 sm:px-6 lg:px-8">
      {/* your form code */}
    </div>
  );
};

export default GetStarted;
