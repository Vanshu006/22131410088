import { useState } from 'react';
import {
  TextField,
  Button,
  Typography,
  Grid,
  Card,
  CardContent,
  Snackbar
} from '@mui/material';
import { generateShortCode } from '../utils/shortCodeGen';
import { isValidURL } from '../utils/validators';
import { log } from '../middleware/logger';

const HomePage = () => {
  const [urls, setUrls] = useState([{ longUrl: '', validity: '', shortcode: '' }]);
  const [shortened, setShortened] = useState([]);
  const [error, setError] = useState('');
  const [open, setOpen] = useState(false);

  const handleChange = (index, field, value) => {
    const newUrls = [...urls];
    newUrls[index][field] = value;
    setUrls(newUrls);
  };

  const addUrlField = () => {
    if (urls.length < 5) {
      setUrls([...urls, { longUrl: '', validity: '', shortcode: '' }]);
    }
  };

  const handleSubmit = () => {
    const results = [];
    for (let i = 0; i < urls.length; i++) {
      const { longUrl, validity, shortcode } = urls[i];

      if (!isValidURL(longUrl)) {
        setError(`URL ${i + 1} is not valid.`);
        setOpen(true);
        log('frontend', 'error', 'component', `Invalid URL at index ${i}`);
        return;
      }

      let code = shortcode.trim() !== '' ? shortcode : generateShortCode();
      const expiry = new Date();
      expiry.setMinutes(
        expiry.getMinutes() + (validity.trim() === '' ? 30 : parseInt(validity))
      );

      results.push({
        shortUrl: `http://localhost:3000/${code}`,
        longUrl,
        expiry: expiry.toLocaleString(),
      });

      localStorage.setItem(code, JSON.stringify({ longUrl, expiry }));
      log('frontend', 'info', 'component', `Short URL created for index ${i}`);
    }
    setShortened(results);
  };

  return (
    <div style={{ padding: 20 }}>
      <Typography variant="h4" gutterBottom>
        URL Shortener
      </Typography>

      {urls.map((url, index) => (
        <Grid container spacing={2} key={index} style={{ marginBottom: 10 }}>
          <Grid item xs={12} sm={4}>
            <TextField
              fullWidth
              label="Original URL"
              value={url.longUrl}
              onChange={(e) => handleChange(index, 'longUrl', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Validity (minutes)"
              value={url.validity}
              onChange={(e) => handleChange(index, 'validity', e.target.value)}
            />
          </Grid>
          <Grid item xs={12} sm={3}>
            <TextField
              fullWidth
              label="Custom Shortcode (optional)"
              value={url.shortcode}
              onChange={(e) => handleChange(index, 'shortcode', e.target.value)}
            />
          </Grid>
        </Grid>
      ))}

      <Button variant="outlined" onClick={addUrlField} disabled={urls.length >= 5}>
        Add Another URL
      </Button>

      <Button
        variant="contained"
        color="primary"
        style={{ marginLeft: 10 }}
        onClick={handleSubmit}
      >
        Shorten URLs
      </Button>

      <div style={{ marginTop: 20 }}>
        {shortened.map((entry, idx) => (
          <Card key={idx} style={{ marginBottom: 10 }}>
            <CardContent>
              <Typography>Original: {entry.longUrl}</Typography>
              <Typography>
                Short: <a href={entry.shortUrl}>{entry.shortUrl}</a>
              </Typography>
              <Typography>Expires: {entry.expiry}</Typography>
            </CardContent>
          </Card>
        ))}
      </div>

      <Snackbar
        open={open}
        autoHideDuration={3000}
        onClose={() => setOpen(false)}
        message={error}
      />
    </div>
  );
};

export default HomePage;