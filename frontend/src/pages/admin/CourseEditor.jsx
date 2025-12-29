import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseById, createCourse, updateCourse, addVideo, clearCourseMessages } from '../../store/slices/courseSlice';
import { Save, Plus, ArrowLeft, Video, GripVertical } from 'lucide-react';

const CourseEditor = () => {
    const { id } = useParams();
    const isNew = id === 'new';
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { currentCourse, isLoading, successMessage } = useSelector((state) => state.courses);

    const [activeTab, setActiveTab] = useState('basic');
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        category: '',
        level: 'beginner',

        thumbnail: '',
        introVideo: '',
        language: 'English',
        isPublished: false
    });


    const [newVideo, setNewVideo] = useState({ title: '', videoUrl: '', duration: 10, isFree: false });

    useEffect(() => {
        if (!isNew) {
            dispatch(fetchCourseById(id));
        }
        dispatch(clearCourseMessages());
    }, [dispatch, id, isNew]);

    useEffect(() => {
        if (!isNew && currentCourse) {
            setFormData({
                title: currentCourse.title || '',
                description: currentCourse.description || '',
                category: currentCourse.category || '',
                level: currentCourse.level || 'beginner',

                thumbnail: currentCourse.thumbnail || '',
                introVideo: currentCourse.introVideo || '',
                language: currentCourse.language || 'English',
                isPublished: currentCourse.isPublished || false
            });
        }
    }, [currentCourse, isNew]);

    useEffect(() => {
        if (successMessage) {
            if (isNew && successMessage.includes('created')) {
                // After create, we might want to stay to add videos, or redirect. 
                // Redirecting to list is fine, user can edit to add videos.
                navigate('/admin/courses');
            }
        }
    }, [successMessage, isNew, navigate]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSave = async () => {
        if (isNew) {
            await dispatch(createCourse(formData));
        } else {
            await dispatch(updateCourse({ id, data: formData }));
        }
    };

    const handleAddVideo = async () => {
        if (!newVideo.title.trim() || !newVideo.videoUrl.trim()) return;
        await dispatch(addVideo({
            courseId: id,
            videoData: { ...newVideo, order: (currentCourse.videos?.length || 0) + 1 }
        }));
        setNewVideo({ title: '', videoUrl: '', duration: 10, isFree: false });
        dispatch(fetchCourseById(id));
    };

    if (isLoading) return <div className="p-8 text-center text-slate-500">Loading editor...</div>;

    return (
        <div className="max-w-4xl mx-auto space-y-6 animate-fade-in pb-20">
            {/* Header */}
            <div className="flex items-center justify-between">
                <button
                    onClick={() => navigate('/admin/courses')}
                    className="flex items-center gap-2 text-slate-500 hover:text-navy-900 dark:hover:text-white transition-colors"
                >
                    <ArrowLeft size={20} />
                    <span>Back to Courses</span>
                </button>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        className="bg-mint-500 hover:bg-mint-400 text-navy-900 font-bold py-2.5 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-mint-500/20 transition-all"
                    >
                        <Save size={20} />
                        {isNew ? 'Create Course' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <div className="bg-white dark:bg-navy-800 rounded-2xl shadow-sm border border-slate-200 dark:border-navy-700 overflow-hidden">
                {/* Tabs */}
                <div className="border-b border-slate-200 dark:border-navy-700 flex">
                    <button
                        onClick={() => setActiveTab('basic')}
                        className={`px-6 py-4 font-medium text-sm transition-colors ${activeTab === 'basic'
                            ? 'text-mint-600 border-b-2 border-mint-500 bg-mint-50 dark:bg-mint-900/10'
                            : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                            }`}
                    >
                        Basic Information
                    </button>
                    {!isNew && (
                        <button
                            onClick={() => setActiveTab('curriculum')}
                            className={`px-6 py-4 font-medium text-sm transition-colors ${activeTab === 'curriculum'
                                ? 'text-mint-600 border-b-2 border-mint-500 bg-mint-50 dark:bg-mint-900/10'
                                : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-300'
                                }`}
                        >
                            Curriculum & Content
                        </button>
                    )}
                </div>

                <div className="p-6">
                    {activeTab === 'basic' && (
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Course Title</label>
                                    <input
                                        type="text"
                                        name="title"
                                        value={formData.title}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg focus:ring-2 focus:ring-mint-500 outline-none"
                                        placeholder="e.g. Advanced React Patterns"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Category</label>
                                    <input
                                        type="text"
                                        name="category"
                                        value={formData.category}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg focus:ring-2 focus:ring-mint-500 outline-none"
                                        placeholder="e.g. Web Development"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Description</label>
                                <textarea
                                    name="description"
                                    value={formData.description}
                                    onChange={handleChange}
                                    rows="4"
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg focus:ring-2 focus:ring-mint-500 outline-none"
                                    placeholder="Course description..."
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                <div>
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Level</label>
                                    <select
                                        name="level"
                                        value={formData.level}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg focus:ring-2 focus:ring-mint-500 outline-none"
                                    >
                                        <option value="beginner">Beginner</option>
                                        <option value="intermediate">Intermediate</option>
                                        <option value="advanced">Advanced</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Language</label>
                                <select
                                    name="language"
                                    value={formData.language}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg focus:ring-2 focus:ring-mint-500 outline-none"
                                >
                                    <option value="English">English</option>
                                    <option value="Spanish">Spanish</option>
                                    <option value="French">French</option>
                                    <option value="German">German</option>
                                    <option value="Chinese">Chinese</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Thumbnail URL</label>
                                <input
                                    type="text"
                                    name="thumbnail"
                                    value={formData.thumbnail}
                                    onChange={handleChange}
                                    className="w-full px-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg focus:ring-2 focus:ring-mint-500 outline-none"
                                    placeholder="https://..."
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    name="isPublished"
                                    id="isPublished"
                                    checked={formData.isPublished}
                                    onChange={handleChange}
                                    className="w-5 h-5 text-mint-500 rounded focus:ring-mint-500"
                                />
                                <label htmlFor="isPublished" className="text-sm font-medium text-slate-700 dark:text-slate-300">Publish Course</label>
                            </div>
                        </div>
                    )}

                    {activeTab === 'curriculum' && (
                        <div className="space-y-6">
                            {/* Videos List */}
                            <div className="space-y-4">
                                {currentCourse?.videos?.map((video, index) => (
                                    <div key={video._id} className="flex items-center gap-3 p-4 bg-white dark:bg-navy-900 rounded-xl border border-slate-200 dark:border-navy-700">
                                        <div className="w-8 h-8 rounded-full bg-slate-100 dark:bg-navy-800 flex items-center justify-center text-sm font-bold text-slate-500">
                                            {index + 1}
                                        </div>
                                        <div className="flex-1">
                                            <h4 className="font-bold text-slate-800 dark:text-white">{video.title}</h4>
                                            <div className="flex items-center gap-3 text-xs text-slate-500 mt-1">
                                                <span>{video.duration}m</span>
                                                {video.isFree && <span className="text-green-500 font-bold">Free Preview</span>}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {/* Placeholder for Edit/Delete video if needed later */}
                                        </div>
                                    </div>
                                ))}
                                {(!currentCourse?.videos || currentCourse.videos.length === 0) && (
                                    <p className="text-center text-slate-400 py-8">No videos added yet.</p>
                                )}
                            </div>

                            {/* Add Video Form */}
                            <div className="p-6 bg-slate-50 dark:bg-navy-900/50 rounded-2xl border border-slate-200 dark:border-navy-700">
                                <h3 className="text-lg font-bold text-navy-900 dark:text-white mb-4">Add New Video</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <input
                                        type="text"
                                        placeholder="Video Title"
                                        value={newVideo.title}
                                        onChange={(e) => setNewVideo({ ...newVideo, title: e.target.value })}
                                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:ring-2 focus:ring-mint-500"
                                    />
                                    <input
                                        type="text"
                                        placeholder="YouTube Video ID or URL"
                                        value={newVideo.videoUrl}
                                        onChange={(e) => setNewVideo({ ...newVideo, videoUrl: e.target.value })}
                                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:ring-2 focus:ring-mint-500"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Duration (minutes)"
                                        value={newVideo.duration}
                                        onChange={(e) => setNewVideo({ ...newVideo, duration: Number(e.target.value) })}
                                        className="px-4 py-2 rounded-xl border border-slate-200 dark:border-navy-700 outline-none focus:ring-2 focus:ring-mint-500"
                                    />
                                    <label className="flex items-center gap-2 text-slate-700 dark:text-slate-300 px-4">
                                        <input
                                            type="checkbox"
                                            checked={newVideo.isFree}
                                            onChange={(e) => setNewVideo({ ...newVideo, isFree: e.target.checked })}
                                            className="w-5 h-5 text-mint-500 rounded focus:ring-mint-500"
                                        />
                                        Free Preview
                                    </label>
                                </div>
                                <button
                                    onClick={handleAddVideo}
                                    className="w-full bg-mint-500 hover:bg-mint-400 text-navy-900 font-bold py-3 rounded-xl transition-colors"
                                >
                                    Add Video to Course
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CourseEditor;
