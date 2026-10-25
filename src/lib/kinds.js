// Business kinds: registered companies, small businesses and sole traders, and freelancers who work for themselves.
export const KINDS = {
  company: { label: "Company", plural: "Companies", icon: "building" },
  small: { label: "Small business", plural: "Small businesses", icon: "store" },
  freelancer: { label: "Freelancer", plural: "Freelancers", icon: "user" },
};

export const isTopRated = (b) => b.rating >= 4.7 && b.reviewCount >= 40;
