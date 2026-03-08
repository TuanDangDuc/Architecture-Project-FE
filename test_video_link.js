const fetch = require('node-fetch');

async function testLinks() {
  const [videosRes, projectsRes] = await Promise.all([
    fetch("https://api.kientrucmaihuong.com/api/video"),
    fetch("https://api.kientrucmaihuong.com/api/project")
  ]);

  const videosData = await videosRes.json();
  const projectsData = await projectsRes.json();

  for (const video of videosData) {
    let linkedProjectId = video.projectId || video.project_id;
    let foundViaProject = null;

    const project = projectsData.find((p) => 
      p.videos && (p.videos.some((v) => v.id === video.id) || p.videos.includes(video.id))
    );

    if (project) {
      foundViaProject = project.id;
    }

    linkedProjectId = linkedProjectId || foundViaProject;
    
    console.log(`Video: ${video.title} (ID: ${video.id})`);
    console.log(`Original projectId: ${video.projectId}`);
    console.log(`Found via Project.videos: ${foundViaProject} (Project Name: ${project ? project.name : 'N/A'})`);
    console.log(`Final linkedProjectId: ${linkedProjectId}`);
    console.log('---');
  }
}
testLinks();
