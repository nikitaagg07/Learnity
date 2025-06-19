import React, { useState, useEffect, useCallback, useRef } from "react";
import {
    Alert,
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    MenuItem,
    Select,
    Button,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    IconButton,
    CircularProgress,
    CardMedia,
    FormControl,
    InputLabel,
    Divider,
    Snackbar
} from "@mui/material";
import { PlayCircle, Lock, Close, Translate, VolumeUp, Check } from "@mui/icons-material";
import { useParams, useNavigate, useLocation} from "react-router-dom";
import { Link } from 'react-router-dom';
import axios from 'axios';
import debounce from 'lodash/debounce';


const CourseDisplayLocked = () => {
    const { courseId } = useParams();
    const [courseDetails, setCourseDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [previewVideo, setPreviewVideo] = useState(null);
    const [showPreviewDialog, setShowPreviewDialog] = useState(false);
    const [isTranslating, setIsTranslating] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [activeAudioElement, setActiveAudioElement] = useState(null);
    const [notification, setNotification] = useState({ open: false, message: "", severity: "info" });
    const [isTranslated, setIsTranslated] = useState(false);

    // Translation states
    const [targetLanguage, setTargetLanguage] = useState('es'); // Default Spanish
    const [translatedData, setTranslatedData] = useState(null);

    const location = useLocation();
    const navigate = useNavigate();

    // Audio elements cache
    const audioCache = useRef({});
    // Translation cache
    const translationCache = useRef({});

    // Configure axios instance with timeout
    const axiosInstance = axios.create({
        timeout: 30000,
    });


    useEffect(() => {

        window.scrollTo(0, 0); 
        
        const fetchCourseData = async () => {
            try {
                const response = await fetch(`http://localhost:5000/api/courses/${courseId}`);
                if (!response.ok) {
                    throw new Error("Failed to fetch course data");
                }
                const data = await response.json();
                setCourseDetails(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchCourseData();
        // Cleanup function
        return () => {
            // Stop any playing audio
            if (activeAudioElement) {
                activeAudioElement.pause();
            }

            // Clear all cached audio elements
            Object.values(audioCache.current).forEach(audio => {
                if (audio) {
                    audio.pause();
                    audio.src = '';
                }
            });
        };
    }, [courseId,location]);

    const getGoogleDriveEmbedUrl = (url) => {
        if (!url) return null;
        const fileId = url.split("/d/")[1]?.split("/")[0];
        return fileId ? `https://drive.google.com/file/d/${fileId}/preview` : null;
    };


    const handlePreview = (videoUrl) => {
        setPreviewVideo(videoUrl);
        setShowPreviewDialog(true);
    };

    const handleLanguageChange = (event) => {
        const newLanguage = event.target.value;
        setTargetLanguage(newLanguage);

        // Check if we already have this translation in cache
        const cacheKey = `${courseId}_${newLanguage}`;
        if (translationCache.current[cacheKey]) {
            setTranslatedData(translationCache.current[cacheKey]);
            setIsTranslated(true);
            showNotification("Translation loaded from cache", "success");
        } else {
            // Reset translated data when changing to a new uncached language
            setTranslatedData(null);
            setIsTranslated(false);
        }
    };

    const translateText = async () => {
        if (!courseDetails) {
            showNotification("Course details are not available yet", "error");
            return;
        }

        try {
            setIsTranslating(true);

            // Check cache first
            const cacheKey = `${courseId}_${targetLanguage}`;
            if (translationCache.current[cacheKey]) {
                setTranslatedData(translationCache.current[cacheKey]);
                setIsTranslated(true);
                setIsTranslating(false);
                showNotification("Translation loaded from cache", "success");
                return;
            }

            const fieldsToTranslate = {
                title: courseDetails.title,
                subtitle: courseDetails.subtitle,
                description: courseDetails.description,
                instructorName: courseDetails.instructorName,
                objectives: courseDetails.objectives,
                curriculum: courseDetails.curriculum?.map(lesson => lesson.title)
            };

            const response = await axiosInstance.post('http://localhost:5000/api/translate', {
                text: fieldsToTranslate,
                target_language: targetLanguage
            });

            if (response.data && response.data.translatedText) {
                const translated = response.data.translatedText;

                const translatedDataResult = {
                    title: translated.title,
                    subtitle: translated.subtitle,
                    description: translated.description,
                    instructorName: translated.instructorName,
                    objectives: translated.objectives,
                    curriculum: translated.curriculum
                };

                // Cache the translation result
                translationCache.current[cacheKey] = translatedDataResult;

                setTranslatedData(translatedDataResult);
                setIsTranslated(true);
                showNotification("Translation completed", "success");
            } else {
                throw new Error("Invalid translation response format");
            }
        } catch (error) {
            console.error("Translation error:", error);
            showNotification("Failed to translate content. Please try again later.", "error");
        } finally {
            setIsTranslating(false);
        }
    };

    // Pre-fetch audio function (can be called for important sections when page loads)
    const prefetchAudio = useCallback(async (text, lang = 'en') => {
        if (!text || text.length < 5) return; // Don't prefetch very short texts

        const cacheKey = `${text.substring(0, 50)}_${lang}`;
        if (audioCache.current[cacheKey]) return; // Already in cache

        try {
            const response = await axiosInstance.post('http://localhost:5000/api/speak', {
                text,
                language: lang
            });

            if (response.data && response.data.audioUrl) {
                // Preload the audio
                const audio = new Audio(response.data.audioUrl);
                audio.preload = 'auto';
                audioCache.current[cacheKey] = audio;
            }
        } catch (error) {
            console.error("Audio prefetch error:", error);
        }
    }, [axiosInstance]);

    // Debounced version of prefetchAudio to avoid too many simultaneous requests
    const debouncedPrefetchAudio = useCallback(
        debounce((text, lang) => prefetchAudio(text, lang), 300),
        [prefetchAudio]
    );

    // Prefetch important content when course details or language changes
    useEffect(() => {
        window.scrollTo(0, 0);  // Scroll to the top of the page

        if (courseDetails) {
            // Prefetch description audio
            const lang = translatedData ? targetLanguage : 'en';
            const description = translatedData?.description || courseDetails.description;

            // Only prefetch if not too long
            if (description && description.length < 1000) {
                debouncedPrefetchAudio(description, lang);
            }
        }
    }, [courseDetails, translatedData, targetLanguage, debouncedPrefetchAudio]);

    const readAloud = async (text, key = 'generic') => {
        if (!text) return;

        // Stop current audio if playing
        if (activeAudioElement) {
            activeAudioElement.pause();
            setActiveAudioElement(null);
            setIsSpeaking(false);

            // If the same audio is clicked, just stop and return
            if (activeAudioElement.dataset.key === key) {
                return;
            }
        }

        // Generate a cache key
        const cacheKey = `${text.substring(0, 50)}_${translatedData ? targetLanguage : 'en'}`;

        try {
            setIsSpeaking(true);

            let audio;
            // Check if audio is already in cache
            if (audioCache.current[cacheKey]) {
                audio = audioCache.current[cacheKey];
            } else {
                // If not in cache, request it
                const response = await axiosInstance.post('http://localhost:5000/api/speak', {
                    text,
                    language: translatedData ? targetLanguage : 'en'
                });

                if (!response.data || !response.data.audioUrl) {
                    throw new Error("Invalid speech response format");
                }

                audio = new Audio(response.data.audioUrl);
                audioCache.current[cacheKey] = audio;
            }

            // Set data attribute correctly
            audio.dataset.key = key;

            audio.onended = () => {
                setIsSpeaking(false);
                setActiveAudioElement(null);
            };

            audio.onerror = (e) => {
                console.error("Audio playback error:", e);
                setIsSpeaking(false);
                setActiveAudioElement(null);
                showNotification("Failed to play audio", "error");
            };

            setActiveAudioElement(audio);
            audio.play();
        } catch (error) {
            console.error("Speech synthesis error:", error);
            setIsSpeaking(false);
            showNotification("Failed to generate speech. Please try again later.", "error");
        }
    };

    const showNotification = (message, severity = "info") => {
        setNotification({
            open: true,
            message,
            severity
        });
    };

    const handleCloseNotification = () => {
        setNotification({ ...notification, open: false });
    };

    const handleEnrollClick = () => {
        const isLoggedIn = localStorage.getItem("authToken");
        if (isLoggedIn) {
            navigate(`/payment/${courseDetails._id}`);
        } else {
            navigate(`/login?courseId=${courseDetails._id}`);
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height="100vh">
                <CircularProgress />
            </Box>
        );
    }



    if (error) {
        return (
            <Typography color="error" align="center">
                {error}
            </Typography>
        );
    }

    return (
        <Box sx={{ maxWidth: 1200, margin: "auto", padding: 3, backgroundColor: "#f9f9f9", py: 2 }}>
            <Card sx={{ mb: 4, backgroundColor: "#263238", color: "white", borderRadius: 2 }}>
                <CardContent>
                    <Typography variant="h4" fontWeight="bold">{translatedData?.title || courseDetails.title}</Typography>
                    <Typography variant="h6"> {translatedData?.subtitle || courseDetails.subtitle}</Typography>
                    <Typography variant="body2" sx={{ mt: 1 }}>
                        Created by {translatedData?.instructorName || courseDetails.instructorName}
                    </Typography>

                    <Box sx={{ mt: 3, display: "flex", alignItems: "center", flexWrap: "wrap", gap: 2 }}>
                        <FormControl size="small" variant="outlined" sx={{ minWidth: 120, bgcolor: "rgba(255,255,255,0.1)", borderRadius: 1 }}>
                            <InputLabel id="language-select-label" sx={{ color: "white" }}>Language</InputLabel>
                            <Select
                                labelId="language-select-label"
                                id="language-select"
                                value={targetLanguage}
                                onChange={handleLanguageChange}
                                label="Language"
                                sx={{ color: "white" }}
                            >
                                <MenuItem value="ar">Arabic</MenuItem>
                                <MenuItem value="as">Assamese</MenuItem>
                                <MenuItem value="bn">Bengali</MenuItem>
                                <MenuItem value="de">German</MenuItem>
                                <MenuItem value="en">English</MenuItem>
                                <MenuItem value="es">Spanish</MenuItem>
                                <MenuItem value="fr">French</MenuItem>
                                <MenuItem value="hi">Hindi</MenuItem>
                                <MenuItem value="gu">Gujarati</MenuItem>
                                <MenuItem value="ja">Japanese</MenuItem>
                                <MenuItem value="kn">Kannada</MenuItem>
                                <MenuItem value="ml">Malayalam</MenuItem>
                                <MenuItem value="mr">Marathi</MenuItem>
                                <MenuItem value="ml">Odia</MenuItem>
                                <MenuItem value="pa">Punjabi</MenuItem>
                                <MenuItem value="ta">Tamil</MenuItem>
                                <MenuItem value="te">Telugu</MenuItem>
                                <MenuItem value="zh-CN">Chinese</MenuItem>
                            </Select>

                        </FormControl>

                        <Button
                            variant="contained"
                            startIcon={isTranslated ? <Check /> : <Translate />}
                            onClick={translateText}
                            disabled={isTranslating}
                            sx={{ bgcolor: "primary.light" }}
                        >
                            {isTranslating ? <CircularProgress size={24} color="inherit" /> : (isTranslated ? "Translated" : "Translate")}
                        </Button>

                        <Button
                            variant="contained"
                            startIcon={isSpeaking ? <Close /> : <VolumeUp />}
                            onClick={() => readAloud(translatedData?.description || courseDetails.description, 'description')}
                            color="secondary"
                        >
                            {isSpeaking ? "Stop" : "Read Description"}
                        </Button>
                    </Box>


                </CardContent>
            </Card>

            <Grid container spacing={4}>
                <Grid item xs={12} md={8}>
                    {/* What You'll Learn Section */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" fontWeight="bold">What You'll Learn</Typography>
                                {(translatedData?.objectives || courseDetails.objectives) && (
                                     <IconButton
                                     color="primary"
                                     onClick={() => readAloud(translatedData?.objectives || courseDetails.objectives)}
                                     disabled={isSpeaking}
                                 >
                                     <VolumeUp />
                                 </IconButton>
                                )}
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            {(translatedData?.objectives || courseDetails.objectives)?.split(",").map((objective, index) => (
                                <Typography key={index} variant="body2" sx={{ mt: 1 }}>
                                    ✔ {objective.trim()}
                                </Typography>
                            ))}
                        </CardContent>
                    </Card>

                    {/* Course Description Section */}
                    <Card sx={{ mb: 3 }}>
                        <CardContent>
                            <Box display="flex" justifyContent="space-between" alignItems="center">
                                <Typography variant="h5" fontWeight="bold">Course Description</Typography>
                                <IconButton
                                    color="primary"
                                    onClick={() => readAloud(translatedData?.description || courseDetails.description)}
                                    disabled={isSpeaking}
                                >
                                    <VolumeUp />
                                </IconButton>
                            </Box>
                            <Divider sx={{ my: 1 }} />
                            <Typography variant="body2">
                                {translatedData?.description || courseDetails.description}
                            </Typography>
                        </CardContent>
                    </Card>

               
                 {/* Course Curriculum Section */}
                         <Card>
                           <CardContent>
                             <Typography variant="h5" fontWeight="bold">Course Curriculum</Typography>
                             <Divider sx={{ my: 1 }} />
                             {(translatedData?.curriculum || courseDetails.curriculum.map(lesson => lesson.title)).map((title, index) => {
                               const lesson = courseDetails.curriculum[index];
                               return (
                                 <Box
                                   key={index}
                                   display="flex"
                                   justifyContent="space-between"
                                   alignItems="center"
                                   sx={{
                                     p: 2,
                                     borderBottom: "1px solid #ddd",
                                     cursor: lesson?.freePreview ? "pointer" : "default",
                                     "&:hover": lesson?.freePreview ? { backgroundColor: "#e0f7fa" } : {},
                                   }}
                                 
                                 >
                                   <Box display="flex" alignItems="center">
                                     {lesson?.freePreview ? (
                                       <PlayCircle sx={{ color: "#0288d1", mr: 2 }} />
                                     ) : (
                                       <Lock sx={{ color: "gray", mr: 2 }} />
                                     )}
                                     <Typography variant="body2">{title}</Typography>
                                   </Box>
                                   <Box display="flex" alignItems="center">
                                     {lesson?.freePreview ? (
                                       <Typography variant="caption" color="success.main" sx={{ mr: 2 }}>
                                         Unlocked
                                       </Typography>
                                     ) : (
                                       <Typography variant="caption" color="text.secondary" sx={{ mr: 2 }}>
                                         Locked
                                       </Typography>
                                     )}
                                     <IconButton
                                       size="small"
                                       onClick={(e) => {
                                         e.stopPropagation();
                                         readAloud(title, `lesson_${index}`);
                                       }}
                                     >
                                       <VolumeUp fontSize="small" />
                                     </IconButton>
                                   </Box>
                                 </Box>
                               );
                             })}
                           </CardContent>
                         </Card>
                       </Grid>

 {/* Preview Dialog */}
                <Dialog open={showPreviewDialog} onClose={() => setShowPreviewDialog(false)} maxWidth="md" fullWidth>
                    <DialogTitle>
                        Course Preview
                        <IconButton aria-label="close" onClick={() => setShowPreviewDialog(false)} sx={{ position: "absolute", right: 10, top: 10 }}>
                            <Close />
                        </IconButton>
                    </DialogTitle>
                    <DialogContent>
                        <Box sx={{ width: "100%", height: 350 }}>
                            <iframe
                                title="Course Video Preview" // Add a meaningful title
                                width="100%"
                                height="350"
                                src={getGoogleDriveEmbedUrl(previewVideo)}
                                frameBorder="0"
                                allow="autoplay; encrypted-media; picture-in-picture"
                                allowFullScreen
                            ></iframe>

                        </Box>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={() => setShowPreviewDialog(false)} color="secondary">Close</Button>
                    </DialogActions>
                </Dialog>

                {/* Notifications */}
                      <Snackbar
                        open={notification.open}
                        autoHideDuration={4000}
                        onClose={handleCloseNotification}
                        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
                      >
                        <Alert onClose={handleCloseNotification} severity={notification.severity} sx={{ width: '100%' }}>
                          {notification.message}
                        </Alert>
                      </Snackbar>


              
          {/* Course Pricing & Enrollment Section */}
                <Grid item xs={12} md={4}>
                    <Card>
                        <CardContent sx={{ textAlign: "center" }}>
                            <CardMedia
                                component="img"
                                alt={courseDetails.title}
                                image={courseDetails.image || "https://via.placeholder.com/300"}
                                title={courseDetails.title}
                                sx={{ height: 200, objectFit: "cover", borderRadius: 1, mb: 2 }}
                            />
                            <Typography variant="h5" fontWeight="bold">
                                ₹{courseDetails.pricing}
                            </Typography>
                            <Button
                                variant="contained"
                                fullWidth
                                onClick={handleEnrollClick}
                                sx={{ mt: 2 }}
                            >
                                Enroll Now
                            </Button>

                        </CardContent>
                    </Card>
                </Grid>
                </Grid>

        </Box>
    );
};

export default CourseDisplayLocked;
