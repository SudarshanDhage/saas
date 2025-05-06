/**
 * Simple script to generate avatar image URLs for testimonials.
 * These URLs can be used to download avatars for local use.
 */

// List of names for which we need avatars
const people = [
  { name: 'Sarah Chen', gender: 'female', filename: 'avatar-woman-1.png' },
  { name: 'Michael Roberts', gender: 'male', filename: 'avatar-man-1.png' },
  { name: 'Aisha Patel', gender: 'female', filename: 'avatar-woman-2.png' },
  { name: 'David Kim', gender: 'male', filename: 'avatar-man-2.png' },
  { name: 'Elena Rodriguez', gender: 'female', filename: 'avatar-woman-3.png' }
];

// Colors to use for the avatars (UI Avatars compatible hex values)
const backgroundColors = {
  female: ['FF90E8', 'FFC0CB', 'FFB6C1', 'FFDAB9', 'D8BFD8'],
  male: ['90CDF4', 'A4CFF4', 'BAE6FD', 'BFDBFE', 'C7D2FE']
};

// Function to generate UI Avatars URL
function generateAvatarUrl(name, gender, index) {
  const encodedName = encodeURIComponent(name);
  const bgColor = backgroundColors[gender][index % backgroundColors[gender].length];
  return `https://ui-avatars.com/api/?name=${encodedName}&background=${bgColor}&color=fff&size=200`;
}

// Generate and display URLs
console.log('Avatar URLs for download:');
console.log('========================');

people.forEach((person, index) => {
  const url = generateAvatarUrl(person.name, person.gender, index);
  console.log(`${person.filename}: ${url}`);
});

console.log('\nUsage:');
console.log('1. Download each image using the URL (curl, wget, or browser)');
console.log('2. Save to /public/images/avatars/ with the specified filename');
console.log('3. Use the local path in your components'); 