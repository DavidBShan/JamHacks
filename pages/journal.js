import { useState } from 'react';
import styles from '../styles/journal.module.css';
import axios from 'axios';
import Link from 'next/link';
import { useUser } from "@auth0/nextjs-auth0/client";
import { Editor } from '@tinymce/tinymce-react';

export default function Home() {
    const [currentPage, setCurrentPage] = useState('journal');
    const { user } = useUser();
    const userName = user ? user.name : "Guest";
    const userPicture = user ? user.picture : "/default-profile.png";
    const [journalEntries, setJournalEntries] = useState([
        { date: '2024-06-04', title: 'First day of journaling', content: 'Example of a journal entry you could write!' }
    ]);
    const [newEntry, setNewEntry] = useState({ date: '', content: '' });
    const [imageDescription, newDescription] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleCreateEntry = async () => {
        const { date, content } = newEntry;
        if (date && content) {
            setJournalEntries([...journalEntries, { date, content }]);
            setNewEntry({ date: '', content: '' });
            try {
                const cleanedContent = content.replace(/<img[^>]+src="data:image\/[^;]+;base64[^"]*"[^>]*>/g, '');
                console.log(`on ${date} ${cleanedContent}` + `The user also attached an image that is about ${imageDescription}`);
                const res = await axios.post('/api/summarize', { prompt: `on ${date} ${cleanedContent}` + `The user also attached an image that is about ${imageDescription}` });
                const jsonArray = JSON.parse(res.data.data);

                for (const { name, description } of jsonArray) {
                    const nodeExists = await axios.post('/api/node-exist', { nodeName: name });
                    if (!nodeExists.data.nodeExists) {
                        await axios.post('/api/add-node', { nodeName: name });
                    }
                    const relationshipExists = await axios.post('/api/relationship-exist', { fromNodeName: userName, toNodeName: name });
                    if (!relationshipExists.data.relationshipExists) {
                        await axios.post('/api/add-relationships', { fromNodeName: userName, toNodeName: name, description });
                    } else {
                        await axios.post('/api/edit-relationships', { fromNodeName: userName, toNodeName: name, newDescription: description });
                    }
                }
            } catch (error) {
                console.error("Error creating journal entry or updating graph database", error);
            }
        }
    };

    const handleEditorChange = (content) => {
        setNewEntry({ ...newEntry, content });
    };

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <Link href="/personal_info" className={styles.sidebarButton}>
                    <img src={userPicture} alt="Profile" className={styles.profilePicture} />
                    <span>{userName}</span>
                </Link>

                <Link href="/journal" className={styles.sidebarButtonMain}>Journal</Link>
                <Link href="/home" className={styles.sidebarButton}>Connection</Link>
                <div className={styles.logoSection}></div>
            </div>
            <div className={styles.content}>
                {journalEntries.map((entry, index) => (
                    <div className={styles.journalEntry} key={index}>
                        <h2 className={styles.journalEntryDate}>{entry.date}</h2>
                        <div
                            className={styles.journalContent}
                            dangerouslySetInnerHTML={{ __html: entry.content }}
                        />
                    </div>
                ))}
                <div className={styles.newEntryContainer}>
                    <div className={styles.newEntry}>
                        <h2 className={styles.journalEntryTopTitle}>Start Journaling</h2>
                        <h2 className={styles.journalTopParagraph}>Type on your keyboard a journal entry with the person's first and last name mentioned. You can add pictures as well!</h2>
                        <input
                            type="date"
                            name="date"
                            value={newEntry.date}
                            onChange={handleInputChange}
                            className={styles.dateInput}
                        />
                        <Editor
                            apiKey='369xjehuhxke9gjzz0qojthbtf0cu84o6v69jso4zn56p1sk'
                            init={{
                                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                tinycomments_mode: 'embedded',
                                tinycomments_author: 'Author name',
                                mergetags_list: [
                                    { value: 'First.Name', title: 'First Name' },
                                    { value: 'Email', title: 'Email' },
                                ],
                                image_title: true,
                                automatic_uploads: true,
                                file_picker_types: 'image',
                                file_picker_callback: (cb, value, meta) => {
                                    const input = document.createElement('input');
                                    input.setAttribute('type', 'file');
                                    input.setAttribute('accept', 'image/*');

                                    input.addEventListener('change', async (e) => {
                                        const file = e.target.files[0];
                                        const reader = new FileReader();
                                        reader.addEventListener('load', async () => {
                                            const id = 'blobid' + (new Date()).getTime();
                                            const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                            const base64 = reader.result.split(',')[1];
                                            const blobInfo = blobCache.create(id, file, base64);
                                            blobCache.add(blobInfo);
                                            cb(blobInfo.blobUri(), { title: file.name });

                                            try {
                                                const res = await axios.post('/api/imagizer', { prompt: base64 });
                                                newDescription(res.data.data);
                                            } catch (error) {
                                                console.error("Error during image upload and processing:", error);
                                            }
                                        });
                                        reader.readAsDataURL(file);
                                    });

                                    input.click();
                                },
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                            }}
                            value={newEntry.content}
                            onEditorChange={handleEditorChange}
                        />
                        <button onClick={handleCreateEntry} className={styles.createButton}>Create</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
