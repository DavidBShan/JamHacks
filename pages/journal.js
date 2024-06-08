import { useState } from 'react';
import styles from '../styles/journal.module.css';
import { useUser } from "@auth0/nextjs-auth0/client";
import { Editor } from '@tinymce/tinymce-react';

export default function Home() {
    const [journalEntries, setJournalEntries] = useState([
        { date: '2024-06-04', title: 'First day of journaling', content: 'Example of a journal entry you could write!' }
    ]);
    const [newEntry, setNewEntry] = useState({ date: '', content: '' });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setNewEntry({ ...newEntry, [name]: value });
    };

    const handleEditorChange = (content) => {
        setNewEntry({ ...newEntry, content });
    };

    const handleCreateEntry = () => {
        const { date, content } = newEntry;
        if (date && content) {
            setJournalEntries([...journalEntries, { date, content }]);
            setNewEntry({ date: '', content: '' });
        }
    };

    const { user, error, isLoading } = useUser();
    const user_name = user ? user.name : "Guest"; // Fallback to "Guest" if user is not defined
    const user_picture = user ? user.picture : "/images/profile-picture.png"; // Fallback to a default profile picture

    return (
        <div className={styles.container}>
            <div className={styles.sidebar}>
                <div className={styles.usernameSection}>
                    {user_name}
                    <img src={user_picture} alt="Profile" className={styles.profilePicture} />
                </div>
                <button className={styles.sidebarButton}>Connection</button>
                <button className={styles.sidebarButton}>Personal Info</button>
                <button className={styles.sidebarButton}>Journal</button>
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
                                plugins: 'anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed linkchecker a11ychecker tinymcespellchecker permanentpen powerpaste advtable advcode editimage advtemplate ai mentions tinycomments tableofcontents footnotes mergetags autocorrect typography inlinecss markdown',
                                toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | addcomment showcomments | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
                                tinycomments_mode: 'embedded',
                                tinycomments_author: 'Author name',


                                mergetags_list: [
                                    { value: 'First.Name', title: 'First Name' },
                                    { value: 'Email', title: 'Email' },
                                ],
                                /* enable title field in the Image dialog*/
                                image_title: true,
                                /* enable automatic uploads of images represented by blob or data URIs*/
                                automatic_uploads: true,
                                /*
                                  URL of our upload handler (for more details check: https://www.tiny.cloud/docs/configure/file-image-upload/#images_upload_url)
                                  images_upload_url: 'postAcceptor.php',
                                  here we add custom filepicker only to Image dialog
                                */
                                file_picker_types: 'image',
                                /* and here's our custom image picker*/
                                file_picker_callback: (cb, value, meta) => {
                                    const input = document.createElement('input');
                                    input.setAttribute('type', 'file');
                                    input.setAttribute('accept', 'image/*');

                                    input.addEventListener('change', (e) => {
                                        const file = e.target.files[0];

                                        const reader = new FileReader();
                                        reader.addEventListener('load', () => {
                                            /*
                                              Note: Now we need to register the blob in TinyMCEs image blob
                                              registry. In the next release this part hopefully won't be
                                              necessary, as we are looking to handle it internally.
                                            */
                                            const id = 'blobid' + (new Date()).getTime();
                                            const blobCache = tinymce.activeEditor.editorUpload.blobCache;
                                            const base64 = reader.result.split(',')[1];
                                            const blobInfo = blobCache.create(id, file, base64);
                                            blobCache.add(blobInfo);

                                            /* call the callback and populate the Title field with the file name */
                                            cb(blobInfo.blobUri(), { title: file.name });
                                        });
                                        reader.readAsDataURL(file);
                                    });

                                    input.click();
                                },
                                content_style: 'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }'
                            }
                            }
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
