/*
  Everything you need to edit lives in this file.

  Photos: the originals are in "images"; web-sized copies (smaller and faster,
  and HEIC converted to JPG) are in "images/web". Point to the web copies here.
  Use as many or as few memories as you like; the stars arrange themselves into
  a heart whatever the count (8 to 20 looks best).
*/
window.OUR_STORY = {
  me: "Jake",
  her: "Avery",

  // The day you got together. Used for the live "time together" counter.
  together: "2023-10-19T00:00:00",

  // Each memory becomes a star in the night sky, in this order around the heart.
  //   photo: path to the image
  //   title: a short name for the memory
  //   when / where: shown under the title
  //   note: a short handwritten line on the bottom of the polaroid
  //   story: the description she reads when she opens it
  memories: [
    {
      photo: "images/web/img_8791.jpg",
      title: "One of our first pictures",
      when: "December 2023",
      where: "at the sports bar in Arlington, VA",
      note: "the beginning of us",
      story: "We were only a couple months into our relationship and I already knew I wanted to be with you forever. My parents said I hadn't looked that happy in a picture in a while."
    },
    {
      photo: "images/web/img_3496.jpg",
      title: "All dressed up",
      when: "May 2024",
      where: "a night out",
      note: "beautiful in that dress",
      story: "No matter what you wear I constantly catch myself staring at you."
    },
    {
      photo: "images/web/img_7119.jpg",
      title: "Graduation day",
      when: "May 2024",
      where: "commencement",
      note: "there was doubt, but I finished",
      story: "You have always been my biggest supporter and I can never thank you enough for helping me through my education. I will always believe you played a big part in my success today."
    },
    {
      photo: "images/web/avery-and-jake-e.jpg",
      title: "Concerts together",
      when: "September 2024",
      where: "Jiffy Lube Live",
      note: "best seat at the concert",
      story: "I could not be more happy going to concerts with you and enjoying good music. You always make the experience wild and fun."
    },
    {
      photo: "images/web/bycarrollcreek.jpg",
      title: "Carroll Creek",
      when: "October 2024",
      where: "downtown Frederick",
      note: "my favorite view",
      story: "No matter how beautiful the background you're always the center piece of the photo."
    },
    {
      photo: "images/web/img_4617.jpg",
      title: "One year",
      when: "October 2024",
      where: "Anniversary photos",
      note: "year one, done",
      story: "Our first anniversary. A whole year of you, and I was already sure I wanted every year after it."
    },
    {
      photo: "images/web/img_8366.jpg",
      title: "The River Walk",
      when: "December 2024",
      where: "San Antonio",
      note: "first trip to Texas",
      story: "I unfortunately did not get a pig, but being in Texas with you made it a trip I will never forget."
    },
    {
      photo: "images/web/img_4878.jpg",
      title: "Texas hunt",
      when: "December 2024",
      where: "Texas",
      note: "you're a beast",
      story: "My first real hunt with you and safe to say it changed my life forever. Now I can't get enough of it."
    },
    {
      photo: "images/web/img_5496.jpg",
      title: "Your big day",
      when: "May 2025",
      where: "Pinning Ceremony",
      note: "so proud of you",
      story: "After all the emotion and late nights and stress you finally achieved your pinning for nursing. I had zero doubt you would and will continue to be a phenomenal nurse."
    },
    {
      photo: "images/web/img_0808.jpg",
      title: "Fourth of July",
      when: "July 2025",
      where: "under the fireworks",
      note: "watching fireworks",
      story: "Our first vacation with my family in Williamsburg. They could not have been more happy you joined us and I had so much fun."
    },
    {
      photo: "images/web/img_1436.jpg",
      title: "Sunset in Africa",
      when: "July 2025",
      where: "halfway around the world",
      note: "can we stay forever?",
      story: "The best trip I have taken in my lifetime. Traveling with you is amazing and I cannot wait to take more trips together."
    },
    {
      photo: "images/web/img_1733.jpg",
      title: "Funny Faces",
      when: "August 2025",
      where: "Death Ridge Brewery",
      note: "you always make me laugh",
      story: "No matter the picture my pose normally stays the same, but there's always one picture in the bunch where we catch a moment like this."
    },
    {
      photo: "images/web/img_2031.jpg",
      title: "Halloween",
      when: "October 2025",
      where: "Game of Thrones",
      note: "winter is coming",
      story: "My favorite Halloween costumes we've ever done. While I may not have the whole look I would like to say I'm Jon Snow."
    },
    {
      photo: "images/web/img_2276.jpg",
      title: "New Years Eve 2026",
      when: "",
      where: "Our third New Years Together",
      note: "always celebrating together",
      story: "I could never ask for a better way to start the year than with my favorite person."
    },
    {
      photo: "images/web/img_2566.jpg",
      title: "The Grand Ole Opry",
      when: "May 2026",
      where: "Nashville",
      note: "I look better with you by my side",
      story: "I've always wanted to take you to the Opry and I am so glad we got to do it together."
    },
    {
      photo: "images/web/img_5594.jpg",
      title: "Beach day",
      when: "September 2026",
      where: "the beach",
      note: "TikTok Poses",
      story: "You always find ways to make things work out. I trusted the process of this pose and it came out amazing."
    }
  ],

  // The timeline, shown in order. Each chapter can have up to 3 photos;
  // she can tap the stack to flip through them.
  chapters: [
    {
      when: "October 2023",
      title: "How it started",
      text: "October 19, 2023 is when this extraordinary relationship started. A dinner at Dutch's Daughter which led to my terrible ability to ask you out. While I thought I knew you were one I would soon find out you had always been the one and my favorite person.",
      photos: ["images/web/img_8816.jpg", "images/web/img_1928.jpg"]
    },
    {
      when: "Year one",
      title: "Completely falling for you",
      text: "From breweries, weddings, concerts, and graduation I knew I had found my love. Shortly into this first year of our relationship I realized I hadn't just gained a girlfriend I had found my best friend.",
      photos: ["images/web/img_2456.jpg", "images/web/img_2728.jpg", "images/web/img_1012.jpg"]
    },
    {
      when: "Year two",
      title: "Going places",
      text: "From family vacations to Williamsburg and Africa to more concerts and even fun weekend getaways just the two of us. I believe year two was the year we found fun in one another and realized how much fun a vacation just the two of us exploring can be.",
      photos: ["images/web/img_8131.jpg", "images/web/img_1081.jpg", "images/web/img_1877.jpg"]
    },
    {
      when: "Year three",
      title: "Still my favorite",
      text: "Hikes, beach vacations with friends, Nashville, and Orioles games. There is no one in the world that I would rather spend my time with. Being by your side makes my life exceptional.",
      photos: ["images/web/img_5580.jpg", "images/web/img_2636.jpg", "images/web/img_2616.jpg"]
    }
  ],

  // Cards she can drag and toss. Each one is a line, with an optional photo.
  // Add focus: "center 15%" (for example) to choose which part of a tall photo shows.
  littleThings: [
    { text: "All the weird pictures you make me take", photo: "images/web/img_1661.jpg" },
    { text: "How you'll commit to any bit", photo: "images/web/img_0140.jpg" },
    { text: "How you always liven the party", photo: "images/web/funny-picture.jpg" },
    { text: "Your faces. All of them.", photo: "images/web/img_8135.jpg" },
    { text: "Interesting photo poses", photo: "images/web/img_8326.jpg" },
    { text: "Trying every new place together", photo: "images/web/img_1917.jpg" },
    { text: "Freezing in a tree stand and not minding, because you're there", photo: "images/web/img_1870.jpg" },
    { text: "Hikes with you", photo: "images/web/img_2635.jpg" },
    { text: "Game days with you", photo: "images/web/img_3454.jpg" },
    { text: "Our ridiculous late-night selfies", photo: "images/web/img_0828.jpg" },
    { text: "Amazing trips together", photo: "images/web/img_1524.jpg", focus: "center 15%" },
    { text: "How you look perfect in every picture (I'm just an addition)", photo: "images/web/dscn4733.jpg" }
  ],

  // Unlocks after she finds every star.
  letter: {
    greeting: "Avery Hue,",
    paragraphs: [
      "I could not be more thankful for the past three years I have spent with you. It feels like it went by in a second yet I feel as if I have known you my whole life. You are my literal best friend.",
      "This website was made to showcase how you've been through everything with me. Exploring, hunting, graduation, concerts, weddings, Africa, vacations with my family, hardships, and all other joys. You have always and will forever be the light in my life. I am so overwhelmed with joy that God brought you into my world.",
      "Thank you for supporting, loving and consistently caring for me. You are and will always be a major reason in my everyday success. I love every bit of you as a person and your character is something that I admire. You are built with an amazing heart and morals and I could not be more proud of all your accomplishments.",
      "I could have nothing in the world and with you I am rich. I love you so much. Happy three year anniversary and a celebration of many more years to come."
    ],
    signoff: "With all my love forever,"
  }
};
