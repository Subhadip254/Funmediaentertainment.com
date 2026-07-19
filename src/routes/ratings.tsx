import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Star } from "lucide-react";
import { site } from "@/config/site";

import { supabase } from "@/integrations/supabase/client";

export const Route = createFileRoute("/ratings")({
  head: () => ({
    meta: [
      { title: `Ratings & Feedback — ${site.name}` },
      { name: "description", content: "Submit your ratings and feedback." },
    ],
  }),
  component: RatingsPage,
});

function RatingsPage() {
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [selectedRole, setSelectedRole] = useState("");

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (rating === 0) {
      toast.error("Please select a star rating");
      return;
    }

    setSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const rawRole = formData.get("role") as string;
    const customRole = formData.get("customRole") as string;
    const finalRole = rawRole === "Other" ? customRole : rawRole;

    const data = {
      name: formData.get("name") as string,
      role: finalRole,
      comments: formData.get("comments") as string,
      rating: rating,
    };

    const { error } = await supabase.from("ratings").insert(data);

    // Also send an email notification via Web3Forms
    try {
      await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          access_key: "5ee7b55a-da3b-4dd8-9ae1-960a27b11994",
          subject: `New ${data.rating}-Star Rating from ${data.name}`,
          name: data.name,
          role: data.role,
          rating: data.rating,
          comments: data.comments,
        }),
      });
    } catch (e) {
      console.error("Failed to send email notification", e);
    }

    setSubmitting(false);

    if (error) {
      console.error(error);
      toast.error(`Error: ${error.message}`);
    } else {
      setDone(true);
      setRating(0);
      setSelectedRole("");
      (e.target as HTMLFormElement).reset();
    }
  }

  return (
    <section className="mx-auto max-w-3xl px-6 py-24 md:py-32">
      <div className="text-center">
        <p className="text-sm uppercase tracking-widest text-muted-foreground">Feedback</p>
        <h1 className="mt-3 font-display text-4xl font-semibold md:text-5xl">
          Ratings & <span className="gradient-text">Reviews</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          We value your feedback. Whether you're an employee or a client, let us know how we're doing.
        </p>
      </div>

      <div className="mt-12">
        {done ? (
          <div className="glass rounded-2xl p-10 text-center animate-fade-up">
            <h2 className="font-display text-2xl font-semibold">Thank you!</h2>
            <p className="mt-3 text-muted-foreground">
              Your feedback has been published to the website. We appreciate your input!
            </p>
            <button
              className="mt-6 rounded-full border border-white/15 px-6 py-2.5 text-sm hover:bg-white/5"
              onClick={() => setDone(false)}
            >
              Submit another review
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="glass grid gap-6 rounded-2xl p-8 animate-fade-up">

            <div className="grid gap-6 md:grid-cols-2">
              <label className="grid gap-2 text-sm">
                <span className="font-medium">Name <span className="text-primary">*</span></span>
                <input
                  name="name"
                  type="text"
                  required
                  className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
                  placeholder="Your full name"
                />
              </label>

              <label className="grid gap-2 text-sm">
                <span className="font-medium">I am a... <span className="text-primary">*</span></span>
                <select
                  name="role"
                  required
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary appearance-none"
                >
                  <option value="" disabled>Select your role</option>
                  <option value="Client">Client</option>
                  <option value="Artist">Artist</option>
                  <option value="Other">Other</option>
                </select>
              </label>

              {selectedRole === "Other" && (
                <label className="grid gap-2 text-sm md:col-span-2 animate-fade-up">
                  <span className="font-medium">Please specify your role <span className="text-primary">*</span></span>
                  <input
                    name="customRole"
                    type="text"
                    required
                    className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary"
                    placeholder="e.g. 3D Animator, Sound Designer, Coordinator"
                  />
                </label>
              )}
            </div>

            <div className="grid gap-2 text-sm text-center py-4">
              <span className="font-medium text-lg">Your Rating <span className="text-primary">*</span></span>
              <div className="flex justify-center gap-2 mt-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="transition-transform hover:scale-110 focus:outline-none"
                  >
                    <Star
                      className={`h-8 w-8 ${star <= (hoverRating || rating)
                        ? "fill-primary text-primary"
                        : "text-muted-foreground/30"
                        } transition-colors duration-200`}
                    />
                  </button>
                ))}
              </div>
            </div>

            <label className="grid gap-2 text-sm">
              <span className="font-medium">Comments <span className="text-primary">*</span></span>
              <textarea
                name="comments"
                rows={4}
                required
                className="rounded-md border border-white/15 bg-background/50 px-3 py-2.5 text-sm outline-none focus:border-primary resize-none"
                placeholder="Share your experience working with us..."
              />
            </label>

            <button
              disabled={submitting}
              className="mt-2 w-full rounded-full btn-neon px-6 py-3.5 text-sm font-semibold disabled:opacity-60"
            >
              {submitting ? "Submitting..." : "Submit Feedback"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
