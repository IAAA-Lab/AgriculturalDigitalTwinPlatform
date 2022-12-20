import React from "react";
import { TwitterTweetEmbed } from "react-twitter-embed";
import { SpinnerDotted } from "spinners-react";

const TwitterSection = () => {
  return (
    <section className="twitter center">
      <div className="reveal-from-right" data-reveal-delay="200">
        <TwitterTweetEmbed
          tweetId="1536101242832822272"
          placeholder={<SpinnerDotted />}
        />
      </div>

      <div className="reveal-from-bottom" data-reveal-delay="200">
        <TwitterTweetEmbed
          tweetId={"1529155977748135937"}
          placeholder={<SpinnerDotted />}
        />
      </div>

      <div className="reveal-from-left" data-reveal-delay="200">
        <TwitterTweetEmbed
          tweetId={"1508717443082035203"}
          placeholder={<SpinnerDotted />}
        />
      </div>
    </section>
  );
};

export default TwitterSection;
