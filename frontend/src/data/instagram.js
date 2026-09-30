const instagramImages = [
	"Gemini_Generated_Image_1nh18u1nh18u1nh1.jfif",
	"Gemini_Generated_Image_5brz1p5brz1p5brz.jfif",
	"Gemini_Generated_Image_75iptm75iptm75ip.jfif",
	"Gemini_Generated_Image_9z3n1f9z3n1f9z3n.jfif",
	"Gemini_Generated_Image_ftbahfftbahfftba.jfif",
	"Gemini_Generated_Image_mp8z00mp8z00mp8z.jfif",
];

export const INSTAGRAM_POSTS = instagramImages.map((image, index) => ({
	id: `ig${index + 1}`,
	image: `/images/${image}`,
}));

export const instagramPosts = INSTAGRAM_POSTS;