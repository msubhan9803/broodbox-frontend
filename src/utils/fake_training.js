const fake_training = [
  {
    _id: 1,
    title: "Beekeeping Basics",
    message: "Protect your bees from extreme weather conditions.",
    description:
      "Provide adequate ventilation in the hive to prevent overheating",
    video_url: "https://www.youtube.com/watch?v=zzsEPYZ0CKI",
  },
  {
    _id: 2,
    title: "Advanced Beekeeping Techniques",
    message: "Provide a clean and well-ventilated hive for your bees.",
    description: "Monitor the honey production and harvest when ready",
    video_url: "https://www.youtube.com/watch?v=Lx6dhaNz88U",
  },
  // {
  //   _id: 3,
  //   title: "Pollination Strategies",
  //   message: "Remember to check on your bees regularly.",
  //   description: "Monitor the honey production and harvest when ready",
  //   video_url: "https://www.youtube.com/watcv=-6J-_H__Zw_",
  // },
  // {
  //   _id: 4,
  //   title: "Queen Bee Management",
  //   message: "Remember to check on your bees regularly.",
  //   description:
  //     "Remember to check on the hive regularly for signs of disease or pests",
  //   video_url: "https://www.youtube.com/watchv=_-2k05q_i-2",
  // },
  // {
  //   _id: 5,
  //   title: "Beekeeping Basics",
  //   message: "Provide a clean and well-ventilated hive for your bees.",
  //   description:
  //     "Remember to check on the hive regularly for signs of disease or pests",
  //   video_url: "https://www.youtube.com/watcv=7g_mZ-_G173",
  // },
  // {
  //   _id: 6,
  //   title: "Advanced Beekeeping Techniques",
  //   message: "Protect your bees from extreme weather conditions.",
  //   description:
  //     "Provide adequate ventilation in the hive to prevent overheating",
  //   video_url: "https://www.youtube.com/watcv=9y2_--X06K-",
  // },
  // {
  //   _id: 7,
  //   title: "Advanced Beekeeping Techniques",
  //   message: "Ensure your bees have enough food supply.",
  //   description: "Monitor the honey production and harvest when ready",
  //   video_url: "https://www.youtube.com/watcv=92bc_a_7_0_",
  // },
  // {
  //   _id: 8,
  //   title: "Beekeeping Basics",
  //   message: "Monitor for signs of disease in your bee colony.",
  //   description:
  //     "Provide adequate ventilation in the hive to prevent overheating",
  //   video_url: "https://www.youtube.com/watcv=-J7--y_oGbh",
  // },
  // {
  //   _id: 9,
  //   title: "Pollination Strategies",
  //   message: "Protect your bees from extreme weather conditions.",
  //   description:
  //     "Remember to check on the hive regularly for signs of disease or pests",
  //   video_url: "https://www.youtube.com/watcv=--_A1V05-91",
  // },
  // {
  //   _id: 10,
  //   title: "Honey Harvesting Fundamentals",
  //   message: "Protect your bees from extreme weather conditions.",
  //   description:
  //     "Remember to check on the hive regularly for signs of disease or pests",
  //   video_url: "https://www.youtube.com/watchv=G_5s__----2",
  // },
  // {
  //   _id: 11,
  //   title: "Honey Harvesting Fundamentals",
  //   message: "Provide a clean and well-ventilated hive for your bees.",
  //   description: "Monitor the honey production and harvest when ready",
  //   video_url: "https://www.youtube.com/watchv=n_M-BR1-U-X",
  // },
  // {
  //   _id: 12,
  //   title: "Queen Bee Management",
  //   message: "Provide a clean and well-ventilated hive for your bees.",
  //   description: "Ensure the bees have access to a water source nearby",
  //   video_url: "https://www.youtube.com/watcv=-03t5-_-7et",
  // },
  // {
  //   _id: 13,
  //   title: "Advanced Beekeeping Techniques",
  //   message: "Monitor for signs of disease in your bee colony.",
  //   description: "Protect the hive from predators such as bears or raccoons",
  //   video_url: "https://www.youtube.com/watcv=--0X_YJ_5__",
  // },
  // {
  //   _id: 14,
  //   title: "Honey Harvesting Fundamentals",
  //   message: "Remember to check on your bees regularly.",
  //   description: "Protect the hive from predators such as bears or raccoons",
  //   video_url: "https://www.youtube.com/watcv=3T-_pvQ-JM2",
  // },
  // {
  //   _id: 15,
  //   title: "Pollination Strategies",
  //   message: "Remember to check on your bees regularly.",
  //   description: "Ensure the bees have access to a water source nearby",
  //   video_url: "https://www.youtube.com/watchv=___Wj-l_-__",
  // },
  // {
  //   _id: 16,
  //   title: "Pollination Strategies",
  //   message: "Provide a clean and well-ventilated hive for your bees.",
  //   description: "Protect the hive from predators such as bears or raccoons",
  //   video_url: "https://www.youtube.com/watchv=-_-_h2v__jG",
  // },
  // {
  //   _id: 17,
  //   title: "Pollination Strategies",
  //   message: "Monitor for signs of disease in your bee colony.",
  //   description: "Monitor the honey production and harvest when ready",
  //   video_url: "https://www.youtube.com/watchv=_bYH-10t_-M",
  // },
  // {
  //   _id: 18,
  //   title: "Beekeeping Basics",
  //   message: "Protect your bees from extreme weather conditions.",
  //   description:
  //     "Remember to check on the hive regularly for signs of disease or pests",
  //   video_url: "https://www.youtube.com/watchv=t9u1-4ys_TY",
  // },
  // {
  //   _id: 19,
  //   title: "Queen Bee Management",
  //   message: "Monitor for signs of disease in your bee colony.",
  //   description: "Protect the hive from predators such as bears or raccoons",
  //   video_url: "https://www.youtube.com/watchv=nZ--_7y-NSe",
  // },
  // {
  //   _id: 20,
  //   title: "Honey Harvesting Fundamentals",
  //   message: "Ensure your bees have enough food supply.",
  //   description: "Protect the hive from predators such as bears or raccoons",
  //   video_url: "https://www.youtube.com/watcv=G0X_62skO-0",
  // },
];
export default fake_training;
