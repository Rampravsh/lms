import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchCourseById, createCourse, updateCourse, addModule, addLesson, clearCourseMessages } from '../../store/slices/courseSlice';
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
        price: 0,
        thumbnail: '',
        introVideo: '',
        isPublished: false
    });

    const [newModuleTitle, setNewModuleTitle] = useState('');
    const [activeModuleId, setActiveModuleId] = useState(null);
    const [newLesson, setNewLesson] = useState({ title: '', videoUrl: '', duration: 10, isFree: false });

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
                price: currentCourse.price || 0,
                thumbnail: currentCourse.thumbnail || '',
                introVideo: currentCourse.introVideo || '',
                isPublished: currentCourse.isPublished || false
            });
        }
    }, [currentCourse, isNew]);

    useEffect(() => {
        if (successMessage) {
            // Optional: Show toast
            if (isNew && successMessage.includes('created')) {
                // Determine new ID differently if possible, for now just go back
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

    const handleAddModule = async () => {
        if (!newModuleTitle.trim()) return;
        await dispatch(addModule({ courseId: id, title: newModuleTitle }));
        setNewModuleTitle('');
        // Refresh course to see new module
        dispatch(fetchCourseById(id));
    };

    const handleAddLesson = async (moduleId) => {
        if (!newLesson.title.trim() || !newLesson.videoUrl.trim()) return;
        await dispatch(addLesson({
            moduleId,
            lessonData: { ...newLesson, order: 99 } // Default order
        }));
        setNewLesson({ title: '', videoUrl: '', duration: 10, isFree: false });
        setActiveModuleId(null);
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
                                    <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Price ($)</label>
                                    <input
                                        type="number"
                                        name="price"
                                        value={formData.price}
                                        onChange={handleChange}
                                        className="w-full px-4 py-2 bg-slate-50 dark:bg-navy-900 border border-slate-200 dark:border-navy-700 rounded-lg focus:ring-2 focus:ring-mint-500 outline-none"
                                    />
                                </div>
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
                            {/* Modules List */}
                            <div className="space-y-4">
                                {currentCourse?.modules?.map((module) => (
                                    <div key={module._id} className="border border-slate-200 dark:border-navy-700 rounded-xl overflow-hidden bg-slate-50 dark:bg-navy-900/50">
                                        <div className="p-4 flex items-center justify-between bg-slate-100 dark:bg-navy-800">
                                            <div className="flex items-center gap-3">
                                                <GripVertical className="text-slate-400 cursor-move" size={20} />
                                                <h4 className="font-bold text-slate-800 dark:text-white">{module.title}</h4>
                                                <span className="text-xs text-slate-500 bg-white dark:bg-navy-900 px-2 py-0.5 rounded-full border border-slate-200 dark:border-navy-700">
                                                    {module.lessons?.length || 0} Lessons
                                                </span>
                                            </div>
                                            <button
                                                onClick={() => setActiveModuleId(activeModuleId === module._id ? null : module._id)}
                                                className="text-mint-600 hover:text-mint-500 text-sm font-medium"
                                            >
                                                {activeModuleId === module._id ? 'Cancel' : 'Add Lesson'}
                                            </button>
                                        </div>

                                        {/* Lessons List within Module */}
                                        <div className="p-4 space-y-2">
                                            {module.lessons?.map((lesson) => (
                                                <div key={lesson._id} className="flex items-center gap-3 p-3 bg-white dark:bg-navy-900 rounded-lg border border-slate-200 dark:border-navy-700">
                                                    <Video size={16} className="text-slate-400" />
                                                    <span className="text-sm font-medium flex-1 text-slate-700 dark:text-slate-300">{lesson.title}</span>
                                                    <span className="text-xs text-slate-400">{lesson.duration}m</span>
                                                    {lesson.isFree && <span className="text-xs text-green-500 font-bold">Free</span>}
                                                </div>
                                            ))}
                                            {(!module.lessons || module.lessons.length === 0) && (
                                                <p className="text-center text-slate-400 text-sm py-2">No lessons in this module.</p>
                                            )}

                                            {/* Add Lesson Form */}
                                            {activeModuleId === module._id && (
                                                <div className="mt-4 p-4 bg-mint-50 dark:bg-mint-900/10 rounded-xl border border-mint-100 dark:border-mint-500/20">
                                                    <h5 className="text-sm font-bold text-mint-800 dark:text-mint-400 mb-3">Add New Lesson</h5>
                                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                                                        <input
                                                            type="text"
                                                            placeholder="Lesson Title"
                                                            value={newLesson.title}
                                                            onChange={(e) => setNewLesson({ ...newLesson, title: e.target.value })}
                                                            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-navy-700 text-sm"
                                                        />
                                                        <input
                                                            type="text"
                                                            placeholder="YouTube Video ID"
                                                            value={newLesson.videoUrl}
                                                            onChange={(e) => setNewLesson({ ...newLesson, videoUrl: e.target.value })}
                                                            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-navy-700 text-sm"
                                                        />
                                                        <input
                                                            type="number"
                                                            placeholder="Duration (min)"
                                                            value={newLesson.duration}
                                                            onChange={(e) => setNewLesson({ ...newLesson, duration: Number(e.target.value) })}
                                                            className="px-3 py-2 rounded-lg border border-slate-200 dark:border-navy-700 text-sm"
                                                        />
                                                        <label className="flex items-center gap-2 text-sm text-slate-600 dark:text-slate-300">
                                                            <input
                                                                type="checkbox"
                                                                checked={newLesson.isFree}
                                                                onChange={(e) => setNewLesson({ ...newLesson, isFree: e.target.checked })}
                                                            />
                                                            Free Preview
                                                        </label>
                                                    </div>
                                                    <button
                                                        onClick={() => handleAddLesson(module._id)}
                                                        className="w-full py-2 bg-mint-500 text-navy-900 font-bold rounded-lg text-sm hover:bg-mint-400"
                                                    >
                                                        Add Lesson
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Add Module Section */}
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="New Module Title"
                                    value={newModuleTitle}
                                    onChange={(e) => setNewModuleTitle(e.target.value)}
                                    className="flex-1 px-4 py-2 bg-white dark:bg-navy-800 border border-slate-200 dark:border-navy-700 rounded-xl focus:ring-2 focus:ring-mint-500 outline-none"
                                />
                                <button
                                    onClick={handleAddModule}
                                    className="bg-slate-800 text-white px-6 py-2 rounded-xl font-bold hover:bg-slate-700"
                                >
                                    Add Module
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
