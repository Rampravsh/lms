const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Course = require('./models/Course');
const Video = require('./models/Video');
const User = require('./models/User');
const coursesData = require('./data/coursesData');

dotenv.config();

const seedCourses = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || "mongodb+srv://admin:admin123@cluster0.ia80cax.mongodb.net/lms?retryWrites=true&w=majority&appName=Cluster0");
        console.log('Connected to DB');

        const instructor = await User.findOne();
        if (!instructor) {
            console.error('No users found. Please create a user first.');
            process.exit(1);
        }

        console.log(`Assigning courses to instructor: ${instructor.name} (${instructor._id})`);

        // Clear existing
        await Course.deleteMany({});
        await Video.deleteMany({});
        console.log('Cleared existing courses and videos');

        for (const courseData of coursesData) {
            console.log(`Processing course: ${courseData.title}`);

            const course = await Course.create({
                title: courseData.title,
                description: courseData.description,

                thumbnail: courseData.thumbnail,
                category: courseData.category,
                level: courseData.level,
                language: courseData.language,
                isPublished: courseData.isPublished,
                instructor: instructor._id
            });

            const videoIds = [];
            let videoOrder = 1;

            if (courseData.modules) {
                for (const module of courseData.modules) {
                    if (module.lessons) {
                        for (const lesson of module.lessons) {
                            const video = await Video.create({
                                title: lesson.title, // or `${module.title}: ${lesson.title}` if we want to preserve module context in title
                                videoUrl: lesson.videoUrl,
                                duration: lesson.duration,
                                isFree: lesson.isFree,
                                course: course._id,
                                order: videoOrder++
                            });
                            videoIds.push(video._id);
                        }
                    }
                }
            }

            course.videos = videoIds;
            await course.save();
            console.log(`Course seeded: ${course.title} with ${videoIds.length} videos`);
        }

        console.log('Seeding complete');
        process.exit(0);

    } catch (error) {
        console.error('Seeding Error:', error);
        process.exit(1);
    }
};

seedCourses();
