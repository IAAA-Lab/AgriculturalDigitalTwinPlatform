import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { SpinnerDotted } from "spinners-react";

const TwitterSection = () => {
  return (
    <section className="twitter">
      <TwitterTweetEmbed
        tweetId="1536101242832822272"
        placeholder={<SpinnerDotted />}
      />

      <TwitterTweetEmbed
        tweetId={"1529155977748135937"}
        placeholder={<SpinnerDotted />}
      />

      <TwitterTweetEmbed
        tweetId={"1508717443082035203"}
        placeholder={<SpinnerDotted />}
      />
    </section>
  );
};

export default TwitterSection;
