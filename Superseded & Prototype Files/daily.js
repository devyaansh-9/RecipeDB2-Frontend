const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const API_KEY = 'LgYd5lGemnqS9A7plQ0owVpkk_wcJKgCNOi80NIiHY79gVfz';
const BASE_URL = 'https://api.foodoscope.com';
const STABILITY_KEY = 'sk-' + '04PvwE0b55M5fxM3zHSMtID8dwXPmXr5JJaimYfMSta58wMv';

async function run() {
  try {
    console.log('Fetching recipe of the day from Foodoscope...');
    const res = await fetch(`${BASE_URL}/recipe2-api/recipe/recipeofday`, {
      headers: { 'Authorization': `Bearer ${API_KEY}` }
    });
    if (!res.ok) throw new Error(`Foodoscope API error: ${res.status}`);
    const data = await res.json();
    
    const recipe = data?.payload?.data || data?.data;
    if (!recipe) throw new Error('No recipe data found');

    const title = recipe.Recipe_title || recipe.title || 'Unknown Recipe';
    const region = recipe.Region || recipe.region || 'World';

    console.log(`Current recipe of the day: "${title}" (${region})`);

    const titleFilePath = path.join(__dirname, 'dist', 'assets', 'recipe_title.txt');
    const imageFilePath = path.join(__dirname, 'dist', 'assets', 'recipe_of_the_day.webp');

    let cachedTitle = '';
    if (fs.existsSync(titleFilePath)) {
      cachedTitle = fs.readFileSync(titleFilePath, 'utf8').trim();
    }

    if (cachedTitle === title && fs.existsSync(imageFilePath)) {
      console.log('Image for this recipe already generated and cached in Git. Exiting.');
      return;
    }

    console.log(`Generating new image via Stability AI for: "${title}"...`);
    const prompt = `Stunning professional food photography of ${title}, ${region} cuisine, beautifully plated on a rustic table, warm lighting, restaurant quality, appetizing colors`;
    
    const formData = new FormData();
    formData.append('prompt', prompt);
    formData.append('output_format', 'webp');

    const stabilityRes = await fetch('https://api.stability.ai/v2beta/stable-image/generate/core', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${STABILITY_KEY}`,
        'Accept': 'image/*'
      },
      body: formData
    });

    if (!stabilityRes.ok) {
      const errText = await stabilityRes.text();
      throw new Error(`Stability API error: ${stabilityRes.status} ${errText}`);
    }

    const arrayBuffer = await stabilityRes.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Ensure assets dir exists
    const assetsDir = path.dirname(titleFilePath);
    if (!fs.existsSync(assetsDir)) {
      fs.mkdirSync(assetsDir, { recursive: true });
    }

    fs.writeFileSync(imageFilePath, buffer);
    fs.writeFileSync(titleFilePath, title, 'utf8');
    console.log('Successfully saved generated image to dist/assets/recipe_of_the_day.webp');

    // Run git commands to commit and push
    console.log('Staging changes to Git...');
    execSync('git add dist/assets/recipe_of_the_day.webp dist/assets/recipe_title.txt', { stdio: 'inherit' });
    execSync(`git commit -m "feat: update daily recipe image for ${title}"`, { stdio: 'inherit' });
    console.log('Pushing to GitHub...');
    execSync('git push origin main', { stdio: 'inherit' });
    console.log('Done!');
  } catch (err) {
    console.error('Error running daily generator:', err);
    process.exit(1);
  }
}

run();
