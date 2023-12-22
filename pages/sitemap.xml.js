const be = process.env.NEXT_PUBLIC_LOCALHOST;
const domain = process.env.NEXT_PUBLIC_BASE_URL;
const awsDom = process.env.NEXT_PUBLIC_AWS;


function generateSiteMap(posts) {
  return `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
     ${posts
       .map(( img ) => {
         return `
       <url>
           <loc>${`${domain}/image/${img.slug}`}</loc>
           <image:image>
            <image:loc>${awsDom}/${img.file}</image:loc>
           </image:image>
       </url>
     `;
       })
       .join('')}
       <url>
           <loc>nidheesh b</loc>
           <image:image>
            <image:loc>https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRiawU-RAolutjd2Rvo72vSLOIxGJl_6yBZkvpkcKnhDq3Uvqt276XyWimIxl6fMDF7RSc&usqp=CAU</image:loc>
           </image:image>
       </url>
    </urlset>
 `;
}

function SiteMap() {
  // getServerSideProps will do the heavy lifting
}

export async function getServerSideProps({ res }) {
  // We make an API call to gather the URLs for our site
  const request = await fetch(`${be}/api/image/sitemap`);
  const posts = await request.json();

  // We generate the XML sitemap with the posts data
  const sitemap = generateSiteMap(posts);

  res.setHeader('Content-Type', 'text/xml');
  // we send the XML to the browser
  res.write(sitemap);
  res.end();

  return {
    props: {},
  };
}

export default SiteMap;